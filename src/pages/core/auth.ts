import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { buildDefaultResponse } from '../../shared/response';
import { LOCAL_SQLITE_STRATEGY } from '../../shared/auth/strategies';
import { User } from '../../shared/models';
import { hashPassword } from '../../shared/auth/password';

export const handleLogoutRequest = (req: Request, res: Response) => {
  req.logout();
  res.redirect('/');
};

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

    if (user.forcePasswordUpdate) {
      res.redirect('/pw-reset');
    } else {
      req.login(user, () => {
        res.redirect('/');
      });
    }
  })(req, res, next);
};

export const handleLoginView = (req: Request, res: Response) => {
  const responseData = buildDefaultResponse(req);
  res.render('login', responseData);
};

export const handlePWResetView = (req: Request, res: Response) => {
  const responseData = buildDefaultResponse(req);
  res.render('pwreset', responseData);
};

export const handlePWResetRequest = (req: Request, res: Response, next: NextFunction) => {
  const responseData = buildDefaultResponse(req);
  passport.authenticate(LOCAL_SQLITE_STRATEGY, (err: Error, user: User) => {
    if (err) {
      responseData.data = {
        errorMessage: err.message,
      };
      res.render('pwreset', responseData);
      return;
    }

    const newPassword = req.body.new_password as string;

    if (newPassword !== req.body.new_password_2) {
      responseData.data = {
        errorMessage: 'The new passwords must match',
      };
      res.render('pwreset', responseData);
      return;
    }

    if (newPassword.length < 8 || newPassword.length > 32) {
      responseData.data = {
        errorMessage: 'The password must be between 8 and 32 characters long',
      };
      res.render('pwreset', responseData);
      return;
    }

    // eslint-disable-next-line no-param-reassign
    user.password = hashPassword(newPassword);
    // eslint-disable-next-line no-param-reassign
    user.forcePasswordUpdate = false;

    user.save({}).then(() => {
      req.login(user, () => {
        res.redirect('/');
      });
    });
  })(req, res, next);
};
