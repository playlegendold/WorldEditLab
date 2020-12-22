import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { Access, Schematic, User } from '../../shared/models';

export const handleIndexUpload = async (req: Request, res: Response) => {
  const { user } = req;
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

  let name = file.name.substr(0, file.name.indexOf('.'));
  if (name.length > 32) name = name.substr(0, 32);

  const schematic = Schematic.build({
    name,
    rawData: file.data,
    access: Access.INTERNAL,
    uploadedById: (user as User).id,
  });

  schematic.save().then(() => {
    res.send({ success: true });
  });
};
