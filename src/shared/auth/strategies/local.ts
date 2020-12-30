import passport from 'passport';
import passportCustom, { VerifiedCallback } from 'passport-custom';
import { Request } from 'express';
import { User } from '../../models';
import { verifyPassword } from '../password';

const CustomStrategy = passportCustom.Strategy;

export interface Strategy {
  init(): void;
}

export const LOCAL_SQLITE_STRATEGY = 'local_sqlite';

export const localStrategy = () => ({
  init() {
    passport.use(
      LOCAL_SQLITE_STRATEGY,
      new CustomStrategy((reg: Request, callback: VerifiedCallback) => {
        User.findOne({
          where: {
            name: reg.body.username,
          },
        }).then((user) => {
          if (user == null || user.password == null) {
            callback(new Error('Invalid username or password'), null);
            return;
          }

          if (verifyPassword(reg.body.password as string, user.password)) {
            callback(null, user);
          } else {
            callback(new Error('Invalid username or password'), null);
          }
        }).catch((err) => {
          callback(err);
        });
      }),
    );

    passport.serializeUser((user: {}, done) => {
      done(null, JSON.stringify(user));
    });

    passport.deserializeUser((userJSON: string, done) => {
      if (userJSON !== '') {
        done(null, JSON.parse(userJSON));
      } else {
        done(new Error('invalid user json object'), undefined);
      }
    });
  },
} as Strategy);
