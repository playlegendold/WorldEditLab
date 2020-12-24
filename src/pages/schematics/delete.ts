import { Request, Response } from 'express';
import { Role, Schematic, User } from '../../shared/models';

export const handleDeleteRequest = async (req: Request, res: Response) => {
  const user = req.user as User;
  if (!user) {
    res.status(403);
    res.send({ success: false, message: 'Forbidden' });
    return;
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
    res.send({ success: true });
  } else {
    res.send({ success: false, message: 'Not found' });
  }
};
