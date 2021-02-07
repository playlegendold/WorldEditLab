import { Router } from 'express';
import { handleSchematicRequest } from './schematic';
import { handleHeightmapRequest } from './heightmap';

export default () => {
  const router = Router();
  router.get('/s/:id', handleSchematicRequest);
  router.get('/h/:id', handleHeightmapRequest);

  return router;
};
