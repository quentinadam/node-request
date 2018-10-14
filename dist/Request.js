"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractRequest_1 = __importDefault(require("./AbstractRequest"));
const RawRequest_1 = __importDefault(require("./RawRequest"));
class Request extends AbstractRequest_1.default {
    constructor(params) {
        super(params);
    }
    createRawRequest(params) {
        return new RawRequest_1.default(params);
    }
}
exports.default = Request;
//# sourceMappingURL=Request.js.map