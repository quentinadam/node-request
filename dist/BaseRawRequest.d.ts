/// <reference types="node" />
import Headers from './Headers';
export declare type Response = {
    statusCode: number;
    statusMessage: string;
    headers: Headers;
};
export declare type RawParams = {
    url: string;
    method: string;
    headers: {
        [key: string]: string | string[];
    };
    body: Buffer;
    timeout: number;
};
export default class BaseRawRequest {
    private responseHandlers;
    private dataHandlers;
    private endHandlers;
    private ended;
    protected readonly url: string;
    protected readonly method: string;
    protected readonly headers: {
        [key: string]: string | string[];
    };
    protected readonly body: Buffer;
    protected readonly timeout: number;
    constructor({ url, method, headers, body, timeout }: RawParams);
    execute(): void;
    onResponse(handler: (response: Response) => void): void;
    onData(handler: (data: Buffer) => void): void;
    onEnd(handler: (error?: Error) => void): void;
    protected emitResponse(response: Response): void;
    protected emitData(data: Buffer): void;
    protected emitEnd(error?: Error): void;
}
