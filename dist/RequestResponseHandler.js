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
const events_1 = require("events");
const zlib = __importStar(require("zlib"));
const Body_1 = __importDefault(require("./Body"));
class Accumulator extends events_1.EventEmitter {
    constructor() {
        super();
        this.buffers = [];
    }
    write(data) {
        this.buffers.push(data);
    }
    end() {
        this.emit('end', Buffer.concat(this.buffers));
    }
}
class GzipAccumulator extends Accumulator {
    constructor() {
        super();
        this.decompressor = zlib.createGunzip();
        this.decompressor.on('data', (buffer) => {
            this.buffers.push(buffer);
        });
        this.decompressor.on('end', () => {
            super.end();
        });
        this.decompressor.on('error', (error) => {
            this.emit('error', error);
        });
    }
    write(buffer) {
        this.decompressor.write(buffer);
    }
    end() {
        this.decompressor.end();
    }
}
class RequestResponseHandler {
    constructor(request, gzip) {
        this.request = request;
        this.gzip = gzip;
    }
    async execute() {
        return new Promise((resolve, reject) => {
            let accumulator;
            this.request.onResponse(({ statusCode, statusMessage, headers }) => {
                if (this.gzip === true && headers['content-encoding'] === 'gzip') {
                    accumulator = new GzipAccumulator();
                }
                else {
                    accumulator = new Accumulator();
                }
                accumulator.on('error', (error) => {
                    reject(error);
                });
                accumulator.on('end', (data) => {
                    resolve({ statusCode, statusMessage, headers, body: new Body_1.default(data, headers['content-type']) });
                });
            });
            this.request.onData((data) => {
                if (accumulator !== undefined) {
                    accumulator.write(data);
                }
            });
            this.request.onEnd((error) => {
                if (error !== undefined) {
                    reject(error);
                }
                else {
                    if (accumulator !== undefined) {
                        accumulator.end();
                    }
                }
            });
            this.request.execute();
        });
    }
}
exports.default = RequestResponseHandler;
//# sourceMappingURL=RequestResponseHandler.js.map