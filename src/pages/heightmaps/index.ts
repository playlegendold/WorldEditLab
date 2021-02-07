import { Router } from 'express';
import { handleIndexView } from './view';
import { handleIndexUpload } from './upload';
import { handleDeleteRequest } from './delete';
import { handleEditRequest } from './edit';
import { asyncHandler } from '../../shared/helpers/errorHandler';

export default () => {
  const router = Router();
  router.get('/', asyncHandler(handleIndexView));
  router.post('/', asyncHandler(handleIndexUpload));
  router.delete('/:uuid', asyncHandler(handleDeleteRequest));
  router.put('/:uuid', asyncHandler(handleEditRequest));
  return router;
};
