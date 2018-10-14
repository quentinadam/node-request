/// <reference types="node" />
import BaseRawRequest, { RawParams } from "./BaseRawRequest";
import Result from './Result';
export { RawParams };
export declare type Params = {
    url: string;
    qs?: {
        [index: string]: string;
    };
    headers?: {
        [index: string]: string | string[];
    };
    method?: string;
    json?: any;
    form?: {
        [index: string]: string;
    };
    body?: Buffer;
    gzip?: boolean;
    keepAlive?: boolean;
    followRedirect?: boolean;
    timeout?: number;
};
export default abstract class AbstractRequest {
    url: string;
    readonly initialUrl: string;
    readonly headers: {
        [key: string]: string | string[];
    };
    readonly method: string;
    readonly body: Buffer;
    readonly gzip: boolean;
    readonly followRedirect: boolean;
    readonly timeout: number;
    constructor(params: Params);
    protected abstract createRawRequest(params: RawParams): BaseRawRequest;
    private combineURL;
    execute(): Promise<Result>;
}
