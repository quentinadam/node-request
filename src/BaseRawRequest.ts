import Headers from './Headers';

export type Response = {
  statusCode: number, 
  statusMessage: string, 
  headers: Headers
};

export type RawParams = {
  url: string, 
  method: string, 
  headers: {[key: string]: string | string[]}, 
  body: Buffer, 
  timeout: number
};

class EventHandlers<T> {

  private handlers = new Set<(t: T) => void>();

  add(handler: (t: T) => void) {
    this.handlers.add(handler);
  }

  emit(data: T) {
    for (const handler of this.handlers) {
      handler(data);
    }
  }

}

export default class BaseRawRequest {

  private responseHandlers = new EventHandlers<Response>();
  private dataHandlers = new EventHandlers<Buffer>();
  private endHandlers = new EventHandlers<Error | undefined>();
  private ended = false;
  
  protected readonly url: string;
  protected readonly method: string;
  protected readonly headers: {[key: string]: string | string[]};
  protected readonly body: Buffer;
  protected readonly timeout: number;

  constructor({url, method, headers, body, timeout}: RawParams) {
    this.url = url;
    this.method = method;
    this.headers = headers;
    this.body = body;
    this.timeout = timeout;
  }

  execute() {
    if (this.timeout !== 0) {
      const timer = setTimeout(() => {
        this.emitEnd(new Error('ETIMEDOUT'));
      }, this.timeout);
      this.onEnd(() => {
        clearTimeout(timer);
      });
    }
  }

  onResponse(handler: (response: Response) => void): void {
    this.responseHandlers.add(handler);
  }

  onData(handler: (data: Buffer) => void): void {
    this.dataHandlers.add(handler);
  }

  onEnd(handler: (error?: Error) => void): void {
    this.endHandlers.add(handler);
  }

  protected emitResponse(response: Response) {
    if (!this.ended) {
      this.responseHandlers.emit(response);
    }
  }

  protected emitData(data: Buffer) {
    if (!this.ended) {
      this.dataHandlers.emit(data);
    }
  }

  protected emitEnd(error?: Error) {
    if (!this.ended) {
      this.ended = true;
      this.endHandlers.emit(error);
    }
  }

}
