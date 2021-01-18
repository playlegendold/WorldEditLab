import { Router } from 'express';
import { handleIndexView } from './view';

export default () => {
  const router = Router();
  router.get('/', handleIndexView);

  return router;
};
