import passport from 'passport';
import passportCustom, { VerifiedCallback } from 'passport-custom';
import { Request } from 'express';
import { Error } from 'sequelize';
import { User } from '../../models';
import { Strategy } from './index';
import { verifyPassword } from '../password';

const CustomStrategy = passportCustom.Strategy;

export const LOCAL_SQLITE_STRATEGY = 'local_sqlite';

export default () => ({
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
            callback(new Error('invalid username or password'), null);
            return;
          }

          if (verifyPassword(reg.body.password as string, user.password)) {
            callback(null, user);
          } else {
            callback(new Error('invalid username or password'), null);
          }
        }).catch((err) => {
          callback(err);
        });
      }),
    );

    passport.serializeUser((user: User, done) => {
      done(null, user.name);
    });

    passport.deserializeUser((name: string, done) => {
      User.findOne({
        where: {
          name,
        },
      }).then((user) => {
        done(null, user);
      }).catch((err) => {
        done(err, null);
      });
    });
  },
} as Strategy);
