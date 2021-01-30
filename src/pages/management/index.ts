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
  handleSchematicCategoryCreateRequest,
  handleSchematicCategoryDeleteRequest,
  handleSchematicCategoryIndexView,
  handleSchematicCategoryPatchRequest,
} from './schematicCategory';
import {
  handleHeightmapCategoryCreateRequest,
  handleHeightmapCategoryDeleteRequest,
  handleHeightmapCategoryIndexView, handleHeightmapCategoryPatchRequest,
} from './heightmapCategory';

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

  router.get('/schematic-categories', handleSchematicCategoryIndexView);
  router.post('/schematic-categories', handleSchematicCategoryCreateRequest);
  router.delete('/schematic-categories/:id', handleSchematicCategoryDeleteRequest);
  router.put('/schematic-categories/:id', handleSchematicCategoryPatchRequest);

  router.get('/heightmap-categories', handleHeightmapCategoryIndexView);
  router.post('/heightmap-categories', handleHeightmapCategoryCreateRequest);
  router.delete('/heightmap-categories/:id', handleHeightmapCategoryDeleteRequest);
  router.put('/heightmap-categories/:id', handleHeightmapCategoryPatchRequest);

  return router;
};
