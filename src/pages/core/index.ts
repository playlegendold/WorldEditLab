import { Router } from 'express';
import {
  handleLoginRequest, handleLoginView, handlePWResetRequest, handlePWResetView,
} from './auth';
import { handleHomeView } from './home';

export default () => {
  const router = Router();
  router.get('/', handleHomeView);
  router.get('/login', handleLoginView);
  router.post('/login', handleLoginRequest);
  router.get('/pw-reset', handlePWResetView);
  router.post('/pw-reset', handlePWResetRequest);

  return router;
};
