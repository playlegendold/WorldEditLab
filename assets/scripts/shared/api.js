export const api = (options, callback, payload) => {
  const request = new XMLHttpRequest();
  request.open(options.method, options.path, true);
  if (options.contentType) {
    request.setRequestHeader('Content-Type', options.contentType);
  }
  request.onload = (event) => {
    callback({
      status: request.status,
      statusText: request.statusText,
      data: request.response,
      _event: event,
      _request: request,
    }, null);
  };
  request.onerror = (event) => {
    callback({
      _event: event,
      _request: request,
    }, event.target.status);
  };
  request.onabort = (event) => {
    callback({
      _event: event,
      _request: request,
    }, event.target.status);
  };
  request.send(payload);
};
