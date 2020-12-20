import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { buildDefaultResponse } from '../../shared/response';
import { LOCAL_SQLITE_STRATEGY } from '../../shared/auth/strategies';
import { User } from '../../shared/models';

export const handleLoginRequest = (req: Request, res: Response, next: NextFunction) => {
  const responseData = buildDefaultResponse(req);
  passport.authenticate(LOCAL_SQLITE_STRATEGY, (err: Error, user: User) => {
    if (err) {
      responseData.data = {
        errorMessage: err.message,
      };
      res.render('login', responseData);
      return;
    }

    req.login(user, () => {
      res.redirect('/');
    });
  })(req, res, next);
};

export const handleLoginView = (req: Request, res: Response) => {
  const responseData = buildDefaultResponse(req);
  res.render('login', responseData);
};
