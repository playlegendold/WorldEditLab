import { Application, Request } from 'express';
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

  app.get('/*', (req: Request) => {
    throw new HTTPErrorResponse(HTTPStatus.NOT_FOUND, `Page not found: ${req.url}`, false);
  });
};
