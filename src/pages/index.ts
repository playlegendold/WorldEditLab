import { Application, Request, Response } from 'express';
import core from './core';
import schematics from './schematics';
import download from './download';
import management from './management';
import { HTTPErrorResponse, HTTPStatus } from '../shared/helpers/errorHandler';

export const initPages = (app: Application) => {
  app.use('/', core());
  app.use('/schematics', schematics());
  app.use('/dl', download());
  app.use('/management', management());

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.get('/*', (req: Request, res: Response) => {
    throw new HTTPErrorResponse(HTTPStatus.NOT_FOUND, `Page not found: ${req.url}`);
  });
};
