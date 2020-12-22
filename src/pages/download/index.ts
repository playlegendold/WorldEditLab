import { Router } from 'express';
import { handleSchematicRequest } from './schematic';

const router = Router();
router.get('/s/:id', handleSchematicRequest);

export default router;
