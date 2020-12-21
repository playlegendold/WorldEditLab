import { Request, Response } from 'express';
import { buildDefaultResponse } from '../../shared/response';

export const handleIndexView = (req: Request, res: Response) => {
  const responseData = buildDefaultResponse(req);
  res.render('schematics', responseData);
};
