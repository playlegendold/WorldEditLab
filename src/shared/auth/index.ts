import { Application } from 'express';
import expressSession from 'express-session';
import passport from 'passport';
import localStrategy from './strategies/local';

export const initAuth = (app: Application) => {
  app.use(expressSession({ secret: 'thisisatestsecret', resave: true, saveUninitialized: true }));
  app.use(passport.initialize());
  app.use(passport.session());

  const strategy = localStrategy();
  strategy.init();
};

export default initAuth;
