import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import {
  Access, Schematic, SchematicFormat, User,
} from '../../shared/models';
import { createResponseFromRow } from './shared';
import { HTTPErrorResponse, HTTPStatus } from '../../shared/helpers/errorHandler';

export const handleIndexUpload = async (req: Request, res: Response) => {
  const user = req.user as User;
  if (!user) {
    throw new HTTPErrorResponse(HTTPStatus.FORBIDDEN, 'Forbidden');
  }

  const file = req.files?.schematic as UploadedFile;

  if (file === undefined) {
    throw new HTTPErrorResponse(HTTPStatus.BAD_REQUEST, 'Invalid file upload');
  }

  const args = file.name.split('.');
  if (args.length !== 2) {
    throw new HTTPErrorResponse(HTTPStatus.BAD_REQUEST, 'Invalid file name');
  }

  const [name, type] = args;

  if (name.length <= 3 || name.length > 32) {
    throw new HTTPErrorResponse(HTTPStatus.BAD_REQUEST, 'Invalid schematic name');
  }

  if (type !== 'schematic' && type !== 'schem') {
    throw new HTTPErrorResponse(HTTPStatus.BAD_REQUEST, 'Invalid schematic type');
  }

  const schematic = Schematic.build({
    name,
    rawData: file.data,
    access: req.body.access !== undefined ? parseInt(req.body.access, 10) : Access.INTERNAL,
    categoryId: (req.body.category !== undefined && req.body.category !== '-1')
      ? parseInt(req.body.category, 10)
      : null,
    uploadedById: user.id,
    format: type === 'schem' ? SchematicFormat.SCHEM : SchematicFormat.SCHEMATIC,
  });

  return schematic.save().then(() => {
    res.send({
      success: true,
      row: createResponseFromRow(schematic, user),
    });
  });
};
