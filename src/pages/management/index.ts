import { Request, Response, Router } from 'express';
import {
  handleUserCreateRequest,
  handleUserDeleteRequest,
  handleUserIndexView,
  handleUserPasswordResetRequest,
  handleUserPatchRequest,
} from './user';
import { Role, User } from '../../shared/models';
import { HTTPError, HTTPStatus } from '../../shared/helpers/errorHandler';
import {
  handleCategoryCreateRequest,
  handleCategoryDeleteRequest,
  handleCategoryIndexView,
  handleCategoryPatchRequest,
} from './schematicCategory';

export const handleIndexView = async (req: Request, res: Response) => {
  const user = req.user as User;
  if (!user || user.role !== Role.ADMIN) {
    return HTTPError(res, HTTPStatus.FORBIDDEN, 'Forbidden');
  }
  return res.redirect('/management/users');
};

export default () => {
  const router = Router();
  router.get('/', handleIndexView);

  router.get('/users', handleUserIndexView);
  router.post('/users', handleUserCreateRequest);
  router.delete('/users/:id', handleUserDeleteRequest);
  router.put('/users/:id', handleUserPatchRequest);
  router.get('/users/:id/pw-reset', handleUserPasswordResetRequest);

  router.get('/schematic-categories', handleCategoryIndexView);
  router.post('/schematic-categories', handleCategoryCreateRequest);
  router.delete('/schematic-categories/:id', handleCategoryDeleteRequest);
  router.put('/schematic-categories/:id', handleCategoryPatchRequest);

  return router;
};
