import { Application } from 'express';
import { handleLoginRequest, handleLoginView } from './auth';
import { handleHomeView } from './home';

const init = (app: Application) => {
  app.get('/', handleHomeView);
  app.get('/login', handleLoginView);
  app.post('/login', handleLoginRequest);
};

export default init;
