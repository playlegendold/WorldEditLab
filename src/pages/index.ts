import { Application } from 'express';
import home from './core';

const initPages = (app: Application) => {
  home(app);
};

export default initPages;
