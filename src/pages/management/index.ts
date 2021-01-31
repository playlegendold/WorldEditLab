import { Request, Response, Router } from 'express';
import {
  handleUserCreateRequest,
  handleUserDeleteRequest,
  handleUserIndexView,
  handleUserPasswordResetRequest,
  handleUserPatchRequest,
} from './user';
import { Role, User } from '../../shared/models';
import { asyncHandler, HTTPErrorResponse, HTTPStatus } from '../../shared/helpers/errorHandler';
import {
  handleCategoryCreateRequest,
  handleCategoryDeleteRequest,
  handleCategoryIndexView,
  handleCategoryPatchRequest,
} from './schematicCategory';

export const handleIndexView = async (req: Request, res: Response) => {
  const user = req.user as User;
  if (!user || user.role !== Role.ADMIN) {
    throw new HTTPErrorResponse(HTTPStatus.FORBIDDEN, 'Forbidden', false);
  }
  return res.redirect('/management/users');
};

export default () => {
  const router = Router();
  router.get('/', handleIndexView);

  router.get('/users', asyncHandler(handleUserIndexView));
  router.post('/users', asyncHandler(handleUserCreateRequest));
  router.delete('/users/:id', asyncHandler(handleUserDeleteRequest));
  router.put('/users/:id', asyncHandler(handleUserPatchRequest));
  router.get('/users/:id/pw-reset', asyncHandler(handleUserPasswordResetRequest));

  router.get('/schematic-categories', asyncHandler(handleCategoryIndexView));
  router.post('/schematic-categories', asyncHandler(handleCategoryCreateRequest));
  router.delete('/schematic-categories/:id', asyncHandler(handleCategoryDeleteRequest));
  router.put('/schematic-categories/:id', asyncHandler(handleCategoryPatchRequest));

  return router;
};
