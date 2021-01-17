import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import {
  Access, Schematic, SchematicFormat, User,
} from '../../shared/models';
import { createResponseFromRow } from './shared';
import { HTTPError, HTTPStatus } from '../../shared/helpers/errorHandler';

export const handleIndexUpload = async (req: Request, res: Response) => {
  const user = req.user as User;
  if (!user) {
    return HTTPError(res, HTTPStatus.FORBIDDEN, 'Forbidden');
  }

  const file = req.files?.schematic as UploadedFile;

  if (file === undefined) {
    return HTTPError(res, HTTPStatus.BAD_REQUEST, 'Invalid file upload');
  }

  const args = file.name.split('.');
  if (args.length !== 2) {
    return HTTPError(res, HTTPStatus.BAD_REQUEST, 'Invalid file name');
  }

  const [name, type] = args;

  if (name.length <= 3 || name.length > 32) {
    return HTTPError(res, HTTPStatus.BAD_REQUEST, 'Invalid schematic name');
  }

  if (type !== 'schematic' && type !== 'schem') {
    return HTTPError(res, HTTPStatus.BAD_REQUEST, 'Invalid schematic type');
  }

  const schematic = Schematic.build({
    name,
    rawData: file.data,
    access: req.body.access !== undefined ? parseInt(req.body.access, 10) : Access.INTERNAL,
    categoryId: (req.body.category !== undefined && req.body.category !== '-1')
      ? parseInt(req.body.category, 10)
      : null,
    uploadedById: (user as User).id,
    format: type === 'schem' ? SchematicFormat.SCHEM : SchematicFormat.SCHEMATIC,
  });

  return schematic.save().then(() => {
    res.send({
      success: true,
      row: createResponseFromRow(schematic, user),
    });
  });
};
