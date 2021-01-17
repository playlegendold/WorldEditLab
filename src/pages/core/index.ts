import { Router } from 'express';
import { handleLoginRequest, handleLoginView } from './auth';
import { handleHomeView } from './home';

export default () => {
  const router = Router();
  router.get('/', handleHomeView);
  router.get('/login', handleLoginView);
  router.post('/login', handleLoginRequest);

  return router;
};
