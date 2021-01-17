import { Request, Response } from 'express';
import { Role, Schematic, User } from '../../shared/models';
import { HTTPError, HTTPStatus } from '../../shared/helpers/errorHandler';

export const handleDeleteRequest = async (req: Request, res: Response) => {
  const user = req.user as User;
  if (!user) {
    return HTTPError(res, HTTPStatus.FORBIDDEN, 'Forbidden');
  }
  let count;

  if (user.role === Role.ADMIN) {
    count = await Schematic.destroy({
      where: {
        uuid: req.params.uuid,
      },
    });
  } else if (user.role === Role.USER) {
    count = await Schematic.destroy({
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
