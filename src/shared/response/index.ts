import { Request } from 'express';
import { ResponseData, User } from '../models';

export const buildDefaultResponse = (req: Request): ResponseData => ({
  header: {
    username: req.user ? (req.user as User).name : undefined,
    role: req.user ? (req.user as User).role.valueOf() : 0,
  },
  navigation: {
    path: req.originalUrl,
    pathArguments: req.originalUrl.substr(1).toLowerCase().split(/\//),
  },
  data: {},
});
