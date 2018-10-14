import AbstractRequest, { Params, RawParams } from './AbstractRequest';
import RawRequest from './RawRequest';
export default class Request extends AbstractRequest {
    constructor(params: Params);
    createRawRequest(params: RawParams): RawRequest;
}
