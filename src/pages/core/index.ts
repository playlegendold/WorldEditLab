import { Application, Request, Response } from 'express';
import { handleLoginRequest } from './auth';

const init = (app: Application) => {
  app.get('/', (req: Request, res: Response) => {
    res.render('index', { message: 'Welcome to WorldEditLab!' });
  });
  app.get('/sign-in', (req: Request, res: Response) => {
    res.render('sign-in');
  });
  app.post('/sign-in', handleLoginRequest);
};

export default init;
