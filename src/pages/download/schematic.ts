import { Request, Response } from 'express';
import { Schematic, SchematicFormat } from '../../shared/models';
import { HTTPStatus } from '../../shared/helpers/errorHandler';

export const returnSchematic = (schematic: Schematic | null, res: Response) => {
  if (schematic === null) {
    res.status(HTTPStatus.NOT_FOUND).send();
  } else {
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Length', schematic.rawData.length);
    res.setHeader('Content-Disposition',
      `attachment;filename="${schematic.name}.${schematic.format === SchematicFormat.SCHEM ? 'schem' : 'schematic'}"`);
    res.send(schematic.rawData);
  }
};

export const handleSchematicRequest = async (req: Request, res: Response) => {
  const schematic = await Schematic.findOne({
    attributes: ['rawData', 'name', 'format'],
    where: {
      uuid: req.params.id,
    },
  });
  returnSchematic(schematic, res);
};
