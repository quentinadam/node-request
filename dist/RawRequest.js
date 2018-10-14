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
const http = __importStar(require("http"));
const https = __importStar(require("https"));
const BaseRawRequest_1 = __importDefault(require("./BaseRawRequest"));
class RawRequest extends BaseRawRequest_1.default {
    constructor(params) {
        super(params);
    }
    parseURL(url) {
        const urlObject = new URL(url);
        let secure;
        if (urlObject.protocol === 'https:') {
            secure = true;
        }
        else if (urlObject.protocol === 'http:') {
            secure = false;
        }
        else {
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
        const { secure, hostname, port, path } = this.parseURL(this.url);
        let request;
        if (secure) {
            request = https.request({ hostname, port, path, method: this.method, agent: RawRequest.httpsAgent });
        }
        else {
            request = http.request({ hostname, port, path, method: this.method, agent: RawRequest.httpAgent });
        }
        this.onEnd((error) => {
            if (error !== undefined && request.socket) {
                request.socket.destroy();
            }
        });
        request.on('response', (res) => {
            this.emitResponse({
                statusCode: res.statusCode,
                statusMessage: res.statusMessage,
                headers: res.headers
            });
            res.on('data', (data) => {
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
RawRequest.httpsAgent = new https.Agent({ keepAlive: true });
RawRequest.httpAgent = new http.Agent({ keepAlive: true });
exports.default = RawRequest;
//# sourceMappingURL=RawRequest.js.map