import { Request } from 'express';
import { ResponseData, User } from '../models';

export const buildDefaultResponse = (req: Request): ResponseData => ({
  header: {
    username: req.user ? (req.user as User).name : undefined,
  },
  data: {},
});

export default buildDefaultResponse;
