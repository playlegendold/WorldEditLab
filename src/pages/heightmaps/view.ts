import { Request, Response } from 'express';
import { FindOptions } from 'sequelize/types/lib/model';
import { Op } from 'sequelize';
import { buildDefaultResponse } from '../../shared/response';
import { Access, User } from '../../shared/models';
import { HeightmapCategory } from '../../shared/models/heightmapCategory';
import { Heightmap } from '../../shared/models/heightmap';
import { createResponseFromRow } from './shared';

export const handleIndexView = async (req: Request, res: Response) => {
  const responseData = buildDefaultResponse(req);

  const isLoggedIn = req.user !== undefined;
  const user = req.user as User;

  const searchOptions: FindOptions = {
    attributes: ['uuid', 'name', 'createdAt', 'access', 'uploadedById', 'categoryId'],
  };

  if (isLoggedIn) {
    searchOptions.where = {
      [Op.or]: {
        access: {
          [Op.lte]: Access.INTERNAL,
        },
        uploadedById: user.id,
      },
    };
    searchOptions.include = [
      {
        model: User,
        attributes: ['name'],
        as: 'uploadedBy',
      },
    ];
  } else {
    searchOptions.where = {
      access: Access.PUBLIC,
    };
  }

  const responseCategories = await HeightmapCategory.findAll({ attributes: ['id', 'name'] });
  const rawResponse = await Heightmap.findAll(searchOptions);
  const response = rawResponse.map((row) => (createResponseFromRow(row, user)));

  responseData.data = {
    baseURL: process.env.BASE_URL,
    runtimeData: JSON.stringify({
      coll: response,
      categories: responseCategories,
    }),
  };

  res.render('heightmaps', responseData);
};
