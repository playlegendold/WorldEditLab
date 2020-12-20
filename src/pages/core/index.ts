import { Application } from 'express';
import passport from 'passport';
import { handleSignInRequest, handleSignInView } from './auth';
import { LOCAL_SQLITE_STRATEGY } from '../../shared/auth/strategies/local';
import { handleHomeView } from './home';

const init = (app: Application) => {
  app.get('/', handleHomeView);
  app.get('/sign-in', handleSignInView);
  app.post('/sign-in', passport.authenticate(LOCAL_SQLITE_STRATEGY), handleSignInRequest);
};

export default init;
