import { EventEmitter } from 'events';
import * as zlib from 'zlib';
import Body from './Body';
import Result from './Result';
import BaseRawRequest from './BaseRawRequest';

class Accumulator extends EventEmitter {

  protected readonly buffers: Buffer[] = [];

  constructor() {
    super();
  }

  write(data: Buffer): void {
    this.buffers.push(data);
  }

  end(): void {
    this.emit('end', Buffer.concat(this.buffers));
  }
}

class GzipAccumulator extends Accumulator {
  
  private readonly decompressor: zlib.Gunzip;
  
  constructor() {
    super();
    this.decompressor = zlib.createGunzip();
    this.decompressor.on('data', (buffer: Buffer) => {
      this.buffers.push(buffer);
    });
    this.decompressor.on('end', () => {
      super.end();
    });
    this.decompressor.on('error', (error: Error) => {
      this.emit('error', error);
    });
  }

  write(buffer: Buffer): void {
    this.decompressor.write(buffer);
  }

  end(): void {
    this.decompressor.end();
  }
}

export default class RequestResponseHandler {

  constructor(
    private readonly request: BaseRawRequest,  
    private readonly gzip: boolean
  ) {}

  async execute() {
    return new Promise<Result>((resolve, reject) => {
      let accumulator: Accumulator | undefined;
      this.request.onResponse(({statusCode, statusMessage, headers}) => {
        if (this.gzip === true && headers['content-encoding'] === 'gzip') {
          accumulator = new GzipAccumulator();
        } else {
          accumulator = new Accumulator();
        }
        accumulator.on('error', (error) => {
          reject(error);
        });
        accumulator.on('end', (data) => {
          resolve({statusCode, statusMessage, headers, body: new Body(data, headers['content-type'])});
        });
      });
      this.request.onData((data) => {
        if (accumulator !== undefined) {
          accumulator.write(data);
        }
      });
      this.request.onEnd((error) => {
        if (error !== undefined) {
          reject(error);
        } else {
          if (accumulator !== undefined) {
            accumulator.end();
          }
        }
      });
      this.request.execute();
    }); 
  }
}
