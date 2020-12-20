import { Application } from 'express';
import core from './core';

const initPages = (app: Application) => {
  app.use('/', core);
};

export default initPages;
