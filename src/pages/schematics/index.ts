import { Router } from 'express';
import { handleIndexView } from './view';
import { handleIndexUpload } from './upload';

const router = Router();
router.get('/', handleIndexView);
router.post('/', handleIndexUpload);

export default router;
