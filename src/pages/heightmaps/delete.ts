import { Request, Response } from 'express';
import { Role, User } from '../../shared/models';
import { HTTPErrorResponse, HTTPStatus } from '../../shared/helpers/errorHandler';
import { Heightmap } from '../../shared/models/heightmap';

export const handleDeleteRequest = async (req: Request, res: Response) => {
  const user = req.user as User;
  if (!user) {
    throw new HTTPErrorResponse(HTTPStatus.FORBIDDEN, 'Forbidden');
  }
  let count: number = 0;

  if (user.role === Role.ADMIN) {
    count = await Heightmap.destroy({
      where: {
        uuid: req.params.uuid,
      },
    });
  } else if (user.role === Role.USER) {
    count = await Heightmap.destroy({
      where: {
        uuid: req.params.uuid,
        uploadedById: user.id,
      },
    });
  }

  if (count === 1) {
    return res.send({ success: true });
  }
  throw new HTTPErrorResponse(HTTPStatus.NOT_FOUND, 'Not found');
};
