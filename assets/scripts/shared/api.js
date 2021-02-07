export const api = (options, callback, payload) => {
  const request = new XMLHttpRequest();
  request.open(options.method, options.path, true);
  if (options.contentType) {
    request.setRequestHeader('Content-Type', options.contentType);
  }
  const internalCallback = (event) => {
    callback({
      status: request.status,
      statusText: request.statusText,
      data: request.response,
      _event: event,
      _request: request,
    }, request.status !== 200)
  }
  request.onload = internalCallback;
  request.onerror = internalCallback;
  request.onabort = internalCallback;
  request.send(payload);
};
