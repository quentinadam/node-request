import { Result, Params, Wrapper, ResponseHandler, Requester } from '@quentinadam/request-core';

const wrapper = new Wrapper(({url, method, headers, body, gzip, timeout}) => {
  console.log(url);
  const responseHandler = new ResponseHandler({gzip});
  const requester = new Requester(responseHandler);
  requester.request({url, method, headers, body, timeout});
  return responseHandler.result;
});

export = function (params: Params): Promise<Result> {
  return wrapper.request(params);
}