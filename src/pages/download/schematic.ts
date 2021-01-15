import { Request, Response } from 'express';
import { Schematic, SchematicFormat } from '../../shared/models';

export const handleSchematicRequest = async (req: Request, res: Response) => {
  const schematic = await Schematic.findOne({
    attributes: ['rawData', 'name', 'format'],
    where: {
      uuid: req.params.id,
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
