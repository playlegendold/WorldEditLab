import { Request, Response } from 'express';
import { buildDefaultResponse } from '../../shared/response';

export const handleIndexView = async (req: Request, res: Response) => {
  const response = buildDefaultResponse(req);

  res.render('heightmaps', response);
};
