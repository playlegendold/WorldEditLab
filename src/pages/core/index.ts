import { Application } from 'express';
import passport from 'passport';
import { handleLoginRequest, handleLoginView } from './auth';
import { LOCAL_SQLITE_STRATEGY } from '../../shared/auth/strategies/local';
import { handleHomeView } from './home';

const init = (app: Application) => {
  app.get('/', handleHomeView);
  app.get('/login', handleLoginView);
  app.post('/login', passport.authenticate(LOCAL_SQLITE_STRATEGY), handleLoginRequest);
};

export default init;
