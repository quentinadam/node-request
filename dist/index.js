"use strict";
const request_core_1 = require("@quentinadam/request-core");
const wrapper = new request_core_1.Wrapper(({ url, method, headers, body, gzip, timeout }) => {
    const responseHandler = new request_core_1.ResponseHandler({ gzip });
    const requester = new request_core_1.Requester(responseHandler);
    requester.request({ url, method, headers, body, timeout });
    return responseHandler.result;
});
module.exports = function (params) {
    return wrapper.request(params);
};
//# sourceMappingURL=index.js.map