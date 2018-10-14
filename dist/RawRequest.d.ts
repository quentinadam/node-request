import BaseRawRequest, { RawParams } from './BaseRawRequest';
export default class RawRequest extends BaseRawRequest {
    private static readonly httpsAgent;
    private static readonly httpAgent;
    constructor(params: RawParams);
    private parseURL;
    execute(): void;
}
