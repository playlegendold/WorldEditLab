import { Request, Response } from 'express';
import {
  Role, Schematic, User,
} from '../../shared/models';
import { HTTPError, HTTPStatus } from '../../shared/helpers/errorHandler';
import { buildDefaultResponse } from '../../shared/response';
import { HeightmapCategory } from '../../shared/models/heightmapCategory';

export const handleHeightmapCategoryIndexView = async (req: Request, res: Response) => {
  const user = req.user as User;
  if (!user || user.role !== Role.ADMIN) {
    return HTTPError(res, HTTPStatus.FORBIDDEN, 'Forbidden');
  }
  const responseCategories = await HeightmapCategory.findAll({ attributes: ['id', 'name'] });

  const responseData = buildDefaultResponse(req);

  responseData.data = {
    rows: JSON.stringify(responseCategories),
    type: 'heightmap',
    title: 'Heightmap Categories',
  };

  return res.render('management-category', responseData);
};

export const handleHeightmapCategoryCreateRequest = async (req: Request, res: Response) => {
  const user = req.user as User;
  if (!user || user.role !== Role.ADMIN) {
    return HTTPError(res, HTTPStatus.FORBIDDEN, 'Forbidden');
  }

  const { name } = req.body;

  if (name.length <= 3 || name.length > 32) {
    return HTTPError(res, HTTPStatus.BAD_REQUEST, 'Invalid category name');
  }

  const category = HeightmapCategory.build({
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

export const handleHeightmapCategoryDeleteRequest = async (req: Request, res: Response) => {
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

  const count = await HeightmapCategory.destroy({
    where: {
      id,
    },
  });

  if (count === 1) {
    return res.send({ success: true });
  }
  return HTTPError(res, HTTPStatus.NOT_FOUND, 'Not found');
};

export const handleHeightmapCategoryPatchRequest = async (req: Request, res: Response) => {
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

  const [count] = await HeightmapCategory.update({
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
