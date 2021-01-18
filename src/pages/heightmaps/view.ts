import { Request, Response } from 'express';

export const handleIndexView = async (req: Request, res: Response) => {
  res.render('heightmaps');
};
