import { Request, Response } from 'express';
import { buildDefaultResponse } from '../../shared/response';

export const handleHomeView = (req: Request, res: Response) => {
  const responseData = buildDefaultResponse(req);
  res.render('index', responseData);
};
