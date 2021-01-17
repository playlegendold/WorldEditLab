import { Router } from 'express';
import { handleSchematicRequest } from './schematic';

export default () => {
  const router = Router();
  router.get('/s/:id', handleSchematicRequest);

  return router;
};
