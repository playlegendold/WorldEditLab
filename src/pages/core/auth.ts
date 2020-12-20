import { Request, Response } from 'express';
import { buildDefaultResponse } from '../../shared/response';

export const handleSignInRequest = (req: Request, res: Response) => {
  res.redirect('/');
};

export const handleSignInView = (req: Request, res: Response) => {
  const responseData = buildDefaultResponse(req);
  res.render('sign-in', responseData);
};
