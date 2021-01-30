import { Router } from 'express';
import { handleIndexView } from './view';
import { handleIndexUpload } from './upload';

export default () => {
  const router = Router();
  router.get('/', handleIndexView);
  router.post('/', handleIndexUpload);

  return router;
};
