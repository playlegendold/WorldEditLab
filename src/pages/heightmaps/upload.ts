import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { Access, User } from '../../shared/models';
import { createResponseFromRow } from './shared';
import { HTTPError, HTTPStatus } from '../../shared/helpers/errorHandler';
import { Heightmap } from '../../shared/models/heightmap';

export const handleIndexUpload = async (req: Request, res: Response) => {
  const user = req.user as User;
  if (!user) {
    return HTTPError(res, HTTPStatus.FORBIDDEN, 'Forbidden');
  }

  const file = req.files?.heightmap as UploadedFile;

  if (file === undefined) {
    return HTTPError(res, HTTPStatus.BAD_REQUEST, 'Invalid file upload');
  }

  const { name } = file;

  if (name.length <= 3 || name.length > 32) {
    return HTTPError(res, HTTPStatus.BAD_REQUEST, 'Invalid heightmap name');
  }

  const heightmap = Heightmap.build({
    name,
    rawData: file.data,
    access: req.body.access !== undefined ? parseInt(req.body.access, 10) : Access.INTERNAL,
    categoryId: (req.body.category !== undefined && req.body.category !== '-1')
      ? parseInt(req.body.category, 10)
      : null,
    uploadedById: (user as User).id,
  });

  return heightmap.save().then(() => {
    res.send({
      success: true,
      row: createResponseFromRow(heightmap, user),
    });
  });
};
