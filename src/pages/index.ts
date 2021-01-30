import { Application } from 'express';
import core from './core';
import schematics from './schematics';
import heightmaps from './heightmaps';
import download from './download';
import management from './management';

export const initPages = (app: Application) => {
  app.use('/', core());
  app.use('/schematics', schematics());
  app.use('/heightmaps', heightmaps());
  app.use('/dl', download());
  app.use('/management', management());
};
