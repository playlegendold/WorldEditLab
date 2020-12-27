import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import {
  Access, Schematic, SchematicFormat, User,
} from '../../shared/models';

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
    access: Access.INTERNAL,
    uploadedById: (user as User).id,
    format: type === 'schem' ? SchematicFormat.SCHEM : SchematicFormat.SCHEMATIC,
  });

  schematic.save().then(() => {
    res.send({
      success: true,
      row: {
        uuid: schematic.uuid,
        name: schematic.name,
        createdAt: schematic.createdAt,
        access: schematic.access,
        uploadedBy: user.name,
        write: schematic.access === Access.PRIVATE || schematic.uploadedById === user?.id,
      },
    });
  });
};
