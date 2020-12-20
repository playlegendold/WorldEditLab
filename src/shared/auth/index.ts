import { Application } from 'express';
import expressSession from 'express-session';
import passport from 'passport';
import { localStrategy } from './strategies';

export const initAuth = (app: Application) => {
  app.use(expressSession({
    secret: process.env.COOKIE_SECRET as string,
    resave: true,
    saveUninitialized: true,
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  const strategy = localStrategy();
  strategy.init();
};
