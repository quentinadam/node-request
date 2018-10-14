/// <reference types="node" />
import Body from './Body';
import Headers from './Headers';
export default interface Result {
    statusCode: number;
    statusMessage: string;
    headers: Headers;
    body: Body;
}
