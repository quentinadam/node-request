import * as http from 'http';
import * as https from 'https';
import BaseRawRequest, { RawParams } from './BaseRawRequest';

export default class RawRequest extends BaseRawRequest {
  
  private static readonly httpsAgent = new https.Agent({ keepAlive: true });
  private static readonly httpAgent = new http.Agent({ keepAlive: true });
  
  constructor(params: RawParams) {
    super(params);
  }

  private parseURL(url: string): {secure: boolean, hostname: string, port: number, path: string} {
    const urlObject = new URL(url);
    let secure: boolean;
    if (urlObject.protocol === 'https:') {
      secure = true;
    } else if (urlObject.protocol === 'http:') {
      secure = false;
    } else {
      throw new Error(`Unsupported protocol ${urlObject.protocol}`);
    }
    return {
      secure: secure,
      hostname: urlObject.hostname,
      port: urlObject.port === '' ? (secure ? 443 : 80) : parseInt(urlObject.port),
      path: urlObject.pathname + urlObject.search,
    };
  }

  execute() {
    super.execute();
    const {secure, hostname, port, path} = this.parseURL(this.url);
    let request: http.ClientRequest;
    if (secure) {
      request = https.request({hostname, port, path, method: this.method, agent: RawRequest.httpsAgent});
    } else {
      request = http.request({hostname, port, path, method: this.method, agent: RawRequest.httpAgent});
    }
    this.onEnd((error?: Error) => {
      if (error !== undefined && request.socket) {
        request.socket.destroy();
      }
    });
    request.on('response', (res: http.IncomingMessage) => {
      this.emitResponse({
        statusCode: res.statusCode!,
        statusMessage: res.statusMessage!,
        headers: res.headers
      });
      res.on('data', (data: Buffer) => {
        this.emitData(data);
      });
      res.on('end', () => {
        this.emitEnd();
      });
      res.on('error', (error) => {
        this.emitEnd(new Error(error.message));
      });
    });
    request.on('error', (error) => {
      this.emitEnd(new Error(error.message));
    });
    for (const key in this.headers) {
      const value = this.headers[key];
      if (value !== undefined) {
        request.setHeader(key, value);
      }
    }
    request.end(this.body);
  }
}
