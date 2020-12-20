import { Request, Response } from 'express';
import { buildDefaultResponse } from '../../shared/response';

type HomeData = {
  message: string;
};

export const handleHomeView = (req: Request, res: Response) => {
  const responseData = buildDefaultResponse(req);

  const data: HomeData = {
    message: 'Welcome to WorldEditLab!',
  };

  responseData.data = data;

  res.render('index', responseData);
};

export default {};
