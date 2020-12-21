import { Router } from 'express';
import { handleIndexView } from './view';

const router = Router();
router.get('/', handleIndexView);

export default router;
