import { Request, Response } from 'express';
import { Role, Schematic, User } from '../../shared/models';

export const handleEditRequest = async (req: Request, res: Response) => {
  const user = req.user as User;
  if (!user) {
    res.status(403);
    res.send({ success: false, message: 'Forbidden' });
    return;
  }

  if (req.body.name.length <= 3
    || req.body.name.length > 32
    || !Number.isInteger(req.body.access)
    || (!Number.isInteger(req.body.category) && req.body.category != null)) {
    res.status(400);
    res.send({ success: false, message: 'Bad Request' });
    return;
  }

  let count: number = 0;

  if (user.role === Role.ADMIN) {
    [count] = await Schematic.update({
      name: req.body.name,
      access: req.body.access,
      categoryId: req.body.category,
    }, {
      where: {
        uuid: req.params.uuid,
      },
    });
  } else if (user.role === Role.USER) {
    [count] = await Schematic.update({
      name: req.body.name,
      access: req.body.access,
      categoryId: req.body.category,
    }, {
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
