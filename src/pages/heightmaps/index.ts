import { Router } from 'express';
import { handleIndexView } from './view';
import { handleIndexUpload } from './upload';
import { handleDeleteRequest } from './delete';

export default () => {
  const router = Router();
  router.get('/', handleIndexView);
  router.post('/', handleIndexUpload);
  router.delete('/:uuid', handleDeleteRequest);
  return router;
};
