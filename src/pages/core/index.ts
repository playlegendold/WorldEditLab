import { Application, Request, Response } from 'express';

const init = (app: Application) => {
  app.get('/', (req: Request, res: Response) => {
    res.render('index', { message: 'Welcome to WorldEditLab!' });
  });
  app.get('/sign-in', (req: Request, res: Response) => {
    res.render('sign-in');
  });
};

export default init;
