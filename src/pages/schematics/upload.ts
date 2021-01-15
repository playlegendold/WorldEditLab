import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import {
  Access, Schematic, SchematicFormat, User,
} from '../../shared/models';
import { createResponseFromRow } from './shared';

export const handleIndexUpload = async (req: Request, res: Response) => {
  const user = req.user as User;
  if (!user) {
    res.status(403);
    res.send({ success: false, message: 'Forbidden' });
    return;
  }

  const file = req.files?.schematic as UploadedFile;

  if (file === undefined) {
    res.status(400);
    res.send({ success: false, message: 'Invalid file upload' });
    return;
  }

  const args = file.name.split('.');
  if (args.length !== 2) {
    res.status(400);
    res.send({ success: false, message: 'Invalid file name' });
    return;
  }

  const [name, type] = args;

  if (name.length <= 3 || name.length > 32) {
    res.status(400);
    res.send({ success: false, message: 'Invalid schematic name' });
    return;
  }

  if (type !== 'schematic' && type !== 'schem') {
    res.status(400);
    res.send({ success: false, message: 'Invalid schematic type' });
    return;
  }

  const schematic = Schematic.build({
    name,
    rawData: file.data,
    access: req.body.access !== undefined ? parseInt(req.body.access, 10) : Access.INTERNAL,
    categoryId: req.body.category !== undefined ? parseInt(req.body.category, 10) : undefined,
    uploadedById: (user as User).id,
    format: type === 'schem' ? SchematicFormat.SCHEM : SchematicFormat.SCHEMATIC,
  });

  schematic.save().then(() => {
    res.send({
      success: true,
      row: createResponseFromRow(schematic, user),
    });
  });
};
