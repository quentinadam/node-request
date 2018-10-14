"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventHandlers {
    constructor() {
        this.handlers = new Set();
    }
    add(handler) {
        this.handlers.add(handler);
    }
    emit(data) {
        for (const handler of this.handlers) {
            handler(data);
        }
    }
}
class BaseRawRequest {
    constructor({ url, method, headers, body, timeout }) {
        this.responseHandlers = new EventHandlers();
        this.dataHandlers = new EventHandlers();
        this.endHandlers = new EventHandlers();
        this.ended = false;
        this.url = url;
        this.method = method;
        this.headers = headers;
        this.body = body;
        this.timeout = timeout;
    }
    execute() {
        if (this.timeout !== 0) {
            const timer = setTimeout(() => {
                this.emitEnd(new Error('ETIMEDOUT'));
            }, this.timeout);
            this.onEnd(() => {
                clearTimeout(timer);
            });
        }
    }
    onResponse(handler) {
        this.responseHandlers.add(handler);
    }
    onData(handler) {
        this.dataHandlers.add(handler);
    }
    onEnd(handler) {
        this.endHandlers.add(handler);
    }
    emitResponse(response) {
        if (!this.ended) {
            this.responseHandlers.emit(response);
        }
    }
    emitData(data) {
        if (!this.ended) {
            this.dataHandlers.emit(data);
        }
    }
    emitEnd(error) {
        if (!this.ended) {
            this.ended = true;
            this.endHandlers.emit(error);
        }
    }
}
exports.default = BaseRawRequest;
//# sourceMappingURL=BaseRawRequest.js.map