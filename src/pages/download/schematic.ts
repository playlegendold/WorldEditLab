import { Request, Response } from 'express';
import { Schematic } from '../../shared/models';

export const handleSchematicRequest = async (req: Request, res: Response) => {
  const schematic = await Schematic.findOne({
    attributes: ['rawData'],
    where: {
      uuid: req.params.id,
    },
  });
  if (schematic === null) {
    res.status(404);
  } else {
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(schematic.rawData);
  }
};
