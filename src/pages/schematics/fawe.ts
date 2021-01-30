import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { Access, Schematic, SchematicFormat } from '../../shared/models';
import { HTTPErrorResponse, HTTPStatus } from '../../shared/helpers/errorHandler';
import { returnSchematic } from '../download/schematic';

export const handleFAWEUpload = async (req: Request, res: Response) => {
  const faweAllowedAddresses = (process.env.FAWE_UPLOAD_ACCESS as string).split(',');
  if (req.header('X-Forwarded-For')) {
    if (!faweAllowedAddresses.includes(req.header('X-Forwarded-For') as string)) {
      throw new HTTPErrorResponse(HTTPStatus.FORBIDDEN, 'Forbidden');
    }
  } else if (!faweAllowedAddresses.includes(req.ip)) {
    throw new HTTPErrorResponse(HTTPStatus.FORBIDDEN, 'Forbidden');
  }

  const file = req.files?.schematicFile as UploadedFile;

  if (file === undefined) {
    throw new HTTPErrorResponse(HTTPStatus.BAD_REQUEST, 'Invalid file upload');
  }

  const queryArgs = Object.keys(req.query);

  if (queryArgs.length !== 1) {
    throw new HTTPErrorResponse(HTTPStatus.BAD_REQUEST, 'Invalid query arguments');
  }

  const name = queryArgs[0].replace(/-/g, '');

  if (name.length !== 32) {
    throw new HTTPErrorResponse(HTTPStatus.BAD_REQUEST, 'Invalid schematic name');
  }

  const schematic = Schematic.build({
    name,
    rawData: file.data,
    access: Access.INTERNAL,
    uploadedById: parseInt(process.env.FAWE_USER_ID as string, 10),
    format: SchematicFormat.SCHEM,
  });

  return schematic.save().then(() => {
    res.send('Success!');
  });
};

export const handleFAWEDirectDownload = async (req: Request, res: Response) => {
  const schematic = await Schematic.findOne({
    attributes: ['rawData', 'name', 'format'],
    where: {
      name: (req.query.key as string).replace(/-/g, ''),
    },
  });
  returnSchematic(schematic, res);
};

export const handleFAWECustomDownload = async (req: Request, res: Response) => {
  const schematic = await Schematic.findOne({
    attributes: ['rawData', 'name', 'format'],
    where: {
      uuid: (req.params.id as string).split('.')[0],
    },
  });
  returnSchematic(schematic, res);
};
