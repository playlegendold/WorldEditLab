import { Request, Response } from 'express';
import { Role, User } from '../../shared/models';
import { HTTPError, HTTPStatus } from '../../shared/helpers/errorHandler';
import { buildDefaultResponse } from '../../shared/response';
import { hashPassword } from '../../shared/auth/password';
import { generateRandomString } from '../../shared/helpers/generate';

export const handleUserIndexView = async (req: Request, res: Response) => {
  const user = req.user as User;
  if (!user || user.role !== Role.ADMIN) {
    return HTTPError(res, HTTPStatus.FORBIDDEN, 'Forbidden');
  }

  const responseUsers = await User.findAll({ attributes: ['id', 'name', 'role'] });

  const responseData = buildDefaultResponse(req);

  responseData.data = {
    rows: JSON.stringify(responseUsers),
  };

  return res.render('management-user', responseData);
};

export const handleUserCreateRequest = async (req: Request, res: Response) => {
  const user = req.user as User;
  if (!user || user.role !== Role.ADMIN) {
    return HTTPError(res, HTTPStatus.FORBIDDEN, 'Forbidden');
  }

  const { name, role } = req.body;

  if (name.length <= 3 || name.length > 32 || !Number.isInteger(role)) {
    return HTTPError(res, HTTPStatus.BAD_REQUEST, 'Bad Request');
  }

  const tempPassword = generateRandomString(8);

  const userModal = User.build({
    name,
    role,
    password: hashPassword(tempPassword),
    forcePasswordUpdate: true,
  });

  return userModal.save().then(() => {
    res.send({
      success: true,
      row: {
        id: userModal.id,
        name: userModal.name,
        role: userModal.role,
        password: tempPassword,
      },
    });
  });
};

export const handleUserDeleteRequest = async (req: Request, res: Response) => {
  const user = req.user as User;
  if (!user || user.role !== Role.ADMIN) {
    return HTTPError(res, HTTPStatus.FORBIDDEN, 'Forbidden');
  }

  const id = parseInt(req.params.id, 10);

  if (!id) {
    return HTTPError(res, HTTPStatus.BAD_REQUEST, 'Invalid id');
  }

  const count = await User.destroy({
    where: {
      id,
    },
  });

  if (count === 1) {
    return res.send({ success: true });
  }
  return HTTPError(res, HTTPStatus.NOT_FOUND, 'Not found');
};

export const handleUserPatchRequest = async (req: Request, res: Response) => {
  const user = req.user as User;
  if (!user) {
    return HTTPError(res, HTTPStatus.FORBIDDEN, 'Forbidden');
  }

  const id = parseInt(req.params.id, 10);

  if (!id) {
    return HTTPError(res, HTTPStatus.BAD_REQUEST, 'Invalid id');
  }

  if (req.body.name.length <= 3
    || req.body.name.length > 32
    || !Number.isInteger(req.body.role)
    || !(req.body.role === 1 || req.body.role === 2)) {
    return HTTPError(res, HTTPStatus.BAD_REQUEST, 'Bad Request');
  }

  const [count] = await User.update({
    name: req.body.name,
    role: req.body.role,
  }, {
    where: {
      id,
    },
  });

  if (count === 1) {
    return res.send({ success: true });
  }
  return HTTPError(res, HTTPStatus.NOT_FOUND, 'Not found');
};
