import { Application, Request, Response } from 'express';

const init = (app: Application) => {
  app.get('/', (req: Request, res: Response) => {
    res.render('index', { message: 'Welcome to WorldEditLab!' });
  });
};

export default init;
