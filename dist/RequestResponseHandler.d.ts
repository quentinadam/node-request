import Result from './Result';
import BaseRawRequest from './BaseRawRequest';
export default class RequestResponseHandler {
    private readonly request;
    private readonly gzip;
    constructor(request: BaseRawRequest, gzip: boolean);
    execute(): Promise<Result>;
}
