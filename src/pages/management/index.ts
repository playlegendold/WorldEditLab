import { Request, Response, Router } from 'express';
import { handleUserIndexView } from './user';
import { User } from '../../shared/models';
import { HTTPError, HTTPStatus } from '../../shared/helpers/errorHandler';
import { buildDefaultResponse } from '../../shared/response';
import { handleCategoryIndexView } from './schematicCategory';

export const handleIndexView = async (req: Request, res: Response) => {
  const user = req.user as User;
  if (!user) {
    return HTTPError(res, HTTPStatus.FORBIDDEN, 'Forbidden');
  }
  const responseData = buildDefaultResponse(req);
  return res.render('management', responseData);
};

export default () => {
  const router = Router();
  router.get('/', handleIndexView);
  router.get('/users', handleUserIndexView);
  router.get('/schematic-categories', handleCategoryIndexView);

  return router;
};
