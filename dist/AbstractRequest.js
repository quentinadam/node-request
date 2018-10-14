"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const querystring = __importStar(require("querystring"));
const RequestResponseHandler_1 = __importDefault(require("./RequestResponseHandler"));
class AbstractRequest {
    constructor(params) {
        this.initialUrl = this.combineURL(params.url, params.qs);
        this.url = this.initialUrl;
        this.headers = {};
        if (params.headers !== undefined) {
            for (const key in params.headers) {
                this.headers[key.toLocaleLowerCase()] = params.headers[key];
            }
        }
        this.method = params.method === undefined ? 'GET' : params.method;
        if (params.json !== undefined) {
            this.headers['content-type'] = 'application/json';
            this.body = Buffer.from(JSON.stringify(params.json));
        }
        else if (params.form !== undefined) {
            this.headers['content-type'] = 'application/x-www-form-urlencoded';
            this.body = Buffer.from(querystring.stringify(params.form));
        }
        else if (params.body !== undefined) {
            this.body = params.body;
        }
        else {
            this.body = Buffer.allocUnsafe(0);
        }
        this.headers['content-length'] = this.body.length.toString();
        if (params.gzip === true || (params.gzip !== false && this.headers['accept-encoding'] === undefined)) {
            this.gzip = true;
            this.headers['accept-encoding'] = 'gzip';
        }
        else {
            this.gzip = false;
        }
        if (params.keepAlive === false) {
            this.headers['connection'] = 'close';
        }
        else if (params.keepAlive === true || this.headers['connection'] === undefined) {
            this.headers['connection'] = 'keep-alive';
        }
        this.followRedirect = (params.followRedirect !== false);
        this.timeout = params.timeout === undefined ? 15000 : params.timeout;
    }
    combineURL(url, qs) {
        if (qs !== undefined) {
            const urlObject = new URL(url);
            if (qs !== undefined) {
                const parameters = urlObject.searchParams;
                for (const key in qs) {
                    parameters.append(key, qs[key]);
                }
                urlObject.search = parameters.toString();
            }
            return urlObject.toString();
        }
        else {
            return url;
        }
    }
    async execute() {
        let count = 0;
        while (true) {
            const request = this.createRawRequest({
                url: this.url,
                method: this.method,
                headers: this.headers,
                body: this.body,
                timeout: this.timeout
            });
            const handler = new RequestResponseHandler_1.default(request, this.gzip);
            const result = await handler.execute();
            const location = result.headers['location'];
            if (this.followRedirect && (result.statusCode === 301 || result.statusCode === 302) && this.method == 'GET' && location !== undefined) {
                if (count < 10) {
                    count++;
                    this.url = location;
                }
                else {
                    throw new Error('Redirection loop');
                }
            }
            else {
                return result;
            }
        }
    }
}
exports.default = AbstractRequest;
//# sourceMappingURL=AbstractRequest.js.map