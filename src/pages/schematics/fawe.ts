import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { Access, Schematic, SchematicFormat } from '../../shared/models';

export const handleFAWEUpload = async (req: Request, res: Response) => {
  const faweAllowedAddresses = (process.env.FAWE_UPLOAD_ACCESS as string).split(',');
  if (req.header('X-Forwarded-For')) {
    if (!faweAllowedAddresses.includes(req.header('X-Forwarded-For') as string)) {
      res.status(403);
      res.send({ success: false, message: 'Forbidden' });
      return;
    }
  } else if (!faweAllowedAddresses.includes(req.ip)) {
    res.status(403);
    res.send({ success: false, message: 'Forbidden' });
    return;
  }

  const file = req.files?.schematicFile as UploadedFile;

  if (file === undefined) {
    res.status(400);
    res.send({ success: false, message: 'Invalid file upload' });
    return;
  }

  const queryArgs = Object.keys(req.query);

  if (queryArgs.length !== 1) {
    res.status(400);
    res.send({ success: false, message: 'Invalid query arguments' });
    return;
  }

  const name = queryArgs[0].replace(/-/g, '');

  if (name.length !== 32) {
    res.status(400);
    res.send({ success: false, message: 'Invalid schematic key' });
    return;
  }

  const schematic = Schematic.build({
    name,
    rawData: file.data,
    access: Access.INTERNAL,
    uploadedById: parseInt(process.env.FAWE_USER_ID as string, 10),
    format: SchematicFormat.SCHEM,
  });

  schematic.save().then(() => {
    res.send('Success!');
  });
};

export const handleFAWEDownload = async (req: Request, res: Response) => {
  const schematic = await Schematic.findOne({
    attributes: ['rawData', 'name', 'format'],
    where: {
      name: (req.query.key as string).replace(/-/g, ''),
    },
  });
  if (schematic === null) {
    res.status(404);
    res.send();
  } else {
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment;filename="${schematic.name}.${schematic.format === SchematicFormat.SCHEM ? 'schem' : 'schematic'}"`);
    res.send(schematic.rawData);
  }
};
