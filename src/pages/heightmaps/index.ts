import { Router } from 'express';
import { handleIndexView } from './view';
import { handleIndexUpload } from './upload';
import { handleDeleteRequest } from './delete';
import { handleEditRequest } from './edit';

export default () => {
  const router = Router();
  router.get('/', handleIndexView);
  router.post('/', handleIndexUpload);
  router.delete('/:uuid', handleDeleteRequest);
  router.put('/:uuid', handleEditRequest);
  return router;
};
