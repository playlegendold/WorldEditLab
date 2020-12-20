import { Request, Response } from 'express';
import { buildDefaultResponse } from '../../shared/response';

export const handleLoginRequest = (req: Request, res: Response) => {
  res.redirect('/');
};

export const handleLoginView = (req: Request, res: Response) => {
  const responseData = buildDefaultResponse(req);
  res.render('login', responseData);
};
