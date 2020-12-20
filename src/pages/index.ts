import { Application } from 'express';
import core from './core';

export const initPages = (app: Application) => {
  app.use('/', core);
};
