import { Request, Response } from 'express';
import { HTTPStatus } from '../../shared/helpers/errorHandler';
import { Heightmap } from '../../shared/models/heightmap';

export const returnHeightmap = (heightmap: Heightmap | null, res: Response) => {
  if (heightmap === null) {
    res.status(HTTPStatus.NOT_FOUND).send();
  } else {
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Length', heightmap.rawData.length);
    res.setHeader('Content-Disposition', `attachment;filename="${heightmap.name}.png"`);
    res.send(heightmap.rawData);
  }
};

export const handleHeightmapRequest = async (req: Request, res: Response) => {
  const schematic = await Heightmap.findOne({
    attributes: ['rawData', 'name'],
    where: {
      uuid: req.params.id,
    },
  });
  returnHeightmap(schematic, res);
};
