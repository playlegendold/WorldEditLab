import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { FindOptions } from 'sequelize/types/lib/model';
import { buildDefaultResponse } from '../../shared/response';
import { Access, Schematic, User } from '../../shared/models';

export const handleIndexView = async (req: Request, res: Response) => {
  const responseData = buildDefaultResponse(req);

  const isLoggedIn = req.user !== undefined;
  const user = req.user as User;

  const searchOptions: FindOptions = {
    attributes: ['uuid', 'name', 'createdAt'],
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
    searchOptions.include = 'uploadedBy';
  } else {
    searchOptions.where = {
      access: Access.PUBLIC,
    };
  }

  responseData.data = {
    baseURL: process.env.BASE_URL,
    tableData: JSON.stringify(await Schematic.findAll(searchOptions)),
  };

  res.render('schematics', responseData);
};
