import { Router } from 'express';
import { handleIndexView } from './view';
import { handleIndexUpload } from './upload';
import { handleDeleteRequest } from './delete';

const router = Router();
router.get('/', handleIndexView);
router.post('/', handleIndexUpload);
router.delete('/:uuid', handleDeleteRequest);

export default router;
