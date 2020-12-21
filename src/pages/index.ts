import { Application } from 'express';
import core from './core';
import schematics from './schematics';

export const initPages = (app: Application) => {
  app.use('/', core);
  app.use('/schematics', schematics);
};
