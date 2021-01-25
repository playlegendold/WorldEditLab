import { Request, Response } from 'express';
import {
  Role, Schematic, SchematicCategory, User,
} from '../../shared/models';
import { HTTPError, HTTPStatus } from '../../shared/helpers/errorHandler';
import { buildDefaultResponse } from '../../shared/response';

export const handleCategoryIndexView = async (req: Request, res: Response) => {
  const user = req.user as User;
  if (!user || user.role !== Role.ADMIN) {
    return HTTPError(res, HTTPStatus.FORBIDDEN, 'Forbidden');
  }
  const responseCategories = await SchematicCategory.findAll({ attributes: ['id', 'name'] });

  const responseData = buildDefaultResponse(req);

  responseData.data = {
    rows: JSON.stringify(responseCategories),
  };

  return res.render('management-schem-category', responseData);
};

export const handleCategoryCreateRequest = async (req: Request, res: Response) => {
  const user = req.user as User;
  if (!user || user.role !== Role.ADMIN) {
    return HTTPError(res, HTTPStatus.FORBIDDEN, 'Forbidden');
  }

  const { name } = req.body;

  if (name.length <= 3 || name.length > 32) {
    return HTTPError(res, HTTPStatus.BAD_REQUEST, 'Invalid category name');
  }

  const category = SchematicCategory.build({
    name,
  });

  return category.save().then(() => {
    res.send({
      success: true,
      row: {
        id: category.id,
        name: category.name,
      },
    });
  });
};

export const handleCategoryDeleteRequest = async (req: Request, res: Response) => {
  const user = req.user as User;
  if (!user || user.role !== Role.ADMIN) {
    return HTTPError(res, HTTPStatus.FORBIDDEN, 'Forbidden');
  }

  const id = parseInt(req.params.id, 10);

  if (!id) {
    return HTTPError(res, HTTPStatus.BAD_REQUEST, 'Invalid id');
  }

  await Schematic.update({
    categoryId: null,
  }, {
    where: {
      categoryId: id,
    },
  });

  const count = await SchematicCategory.destroy({
    where: {
      id,
    },
  });

  if (count === 1) {
    return res.send({ success: true });
  }
  return HTTPError(res, HTTPStatus.NOT_FOUND, 'Not found');
};

export const handleCategoryPatchRequest = async (req: Request, res: Response) => {
  const user = req.user as User;
  if (!user) {
    return HTTPError(res, HTTPStatus.FORBIDDEN, 'Forbidden');
  }

  const id = parseInt(req.params.id, 10);

  if (!id) {
    return HTTPError(res, HTTPStatus.BAD_REQUEST, 'Invalid id');
  }

  if (req.body.name.length <= 3
    || req.body.name.length > 32) {
    return HTTPError(res, HTTPStatus.BAD_REQUEST, 'Bad Request');
  }

  const [count] = await SchematicCategory.update({
    name: req.body.name,
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
