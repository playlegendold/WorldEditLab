import { Application, Request, Response } from 'express';
import core from './core';
import schematics from './schematics';
import download from './download';
import { HTTPErrorResponse, HTTPStatus } from '../shared/helpers/errorHandler';

export const initPages = (app: Application) => {
  app.use('/', core());
  app.use('/schematics', schematics());
  app.use('/dl', download());

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.get('/*', (req: Request, res: Response) => {
    throw new HTTPErrorResponse(HTTPStatus.NOT_FOUND, `Page not found: ${req.url}`);
  });
};
