import {
  NextFunction, Request, Response, RequestHandler,
} from 'express';
import { buildDefaultResponse } from '../response';

export enum HTTPStatus {
  // Client Errors
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  PROXY_AUTHENTICATION_REQUIRED = 407,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  GONE = 410,
  LENGTH_REQUIRED = 411,
  PRECONDITION_FAILED = 412,
  REQUEST_ENTITY_TOO_LARGE = 413,
  'REQUEST-URI_TOO_LONG' = 414,
  UNSUPPORTED_MEDIA_TYPE = 415,
  REQUESTED_RANGE_NOT_SATISFIABLE = 416,
  EXPECTATION_FAILED = 417,
  PRECONDITION_REQUIRED = 428,
  TOO_MANY_REQUESTS = 429,

  // Server Errors
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  HTTP_VERSION_NOT_SUPPORTED = 505,
}

export class HTTPErrorResponse extends Error {
  status: HTTPStatus;

  message: string;

  api: boolean;

  constructor(status: HTTPStatus, message: string, api: boolean = true) {
    super(message);
    this.status = status;
    this.message = message;
    this.api = api;
  }
}

export const printErrorPage = (req: Request, res: Response, message: string, status: number) => {
  const baseResponse = buildDefaultResponse(req);
  baseResponse.data = {
    error: {
      message,
      status,
    },
  };
  res.render('error-page', baseResponse);
};

export const asyncHandler = (handler: RequestHandler) => (
  (req: Request, res: Response, next: NextFunction) => (
    Promise.resolve(handler(req, res, next)).catch(next)
  )
);

export const errorHandler = (
  err: Error | HTTPErrorResponse,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  if ((err as HTTPErrorResponse).status) {
    const errorResponse = err as HTTPErrorResponse;
    if (errorResponse.api) {
      res.type('application/json');
      res
        .status(errorResponse.status)
        .send({ success: false, message: errorResponse.message });
    } else {
      printErrorPage(req, res, errorResponse.message, errorResponse.status.valueOf());
    }
  } else {
    printErrorPage(req, res, err.message, HTTPStatus.INTERNAL_SERVER_ERROR.valueOf());
  }
};
