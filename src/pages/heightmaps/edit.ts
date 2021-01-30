import { Request, Response } from 'express';
import { Role, User } from '../../shared/models';
import { HTTPError, HTTPStatus } from '../../shared/helpers/errorHandler';
import { Heightmap } from '../../shared/models/heightmap';

export const handleEditRequest = async (req: Request, res: Response) => {
  const user = req.user as User;
  if (!user) {
    return HTTPError(res, HTTPStatus.FORBIDDEN, 'Forbidden');
  }

  if (req.body.name.length <= 3
    || req.body.name.length > 32
    || !Number.isInteger(req.body.access)
    || (!Number.isInteger(req.body.category) && req.body.category != null)) {
    return HTTPError(res, HTTPStatus.BAD_REQUEST, 'Bad Request');
  }

  let count: number = 0;

  if (user.role === Role.ADMIN) {
    [count] = await Heightmap.update({
      name: req.body.name,
      access: req.body.access,
      categoryId: req.body.category === -1 ? null : req.body.category,
    }, {
      where: {
        uuid: req.params.uuid,
      },
    });
  } else if (user.role === Role.USER) {
    [count] = await Heightmap.update({
      name: req.body.name,
      access: req.body.access,
      categoryId: req.body.category === -1 ? null : req.body.category,
    }, {
      where: {
        uuid: req.params.uuid,
        uploadedById: user.id,
      },
    });
  }

  if (count === 1) {
    return res.send({ success: true });
  }
  return HTTPError(res, HTTPStatus.NOT_FOUND, 'Not found');
};
