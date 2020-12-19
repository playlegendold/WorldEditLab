import { Application } from 'express';
import home from './home';

const initPages = (app: Application) => {
  home(app);
};

export default initPages;
