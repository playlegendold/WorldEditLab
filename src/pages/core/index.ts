import { Router } from 'express';
import {
  handleLoginRequest, handleLoginView, handleLogoutRequest, handlePWResetRequest, handlePWResetView,
} from './auth';
import { handleHomeView } from './home';

export default () => {
  const router = Router();
  router.get('/', handleHomeView);
  router.get('/login', handleLoginView);
  router.get('/logout', handleLogoutRequest);
  router.post('/login', handleLoginRequest);
  router.get('/pw-reset', handlePWResetView);
  router.post('/pw-reset', handlePWResetRequest);

  return router;
};
