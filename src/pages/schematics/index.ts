import { Router } from 'express';
import { handleIndexView } from './view';
import { handleIndexUpload } from './upload';
import { handleDeleteRequest } from './delete';
import { handleEditRequest } from './edit';

const router = Router();
router.get('/', handleIndexView);
router.post('/', handleIndexUpload);
router.put('/:uuid', handleEditRequest);
router.delete('/:uuid', handleDeleteRequest);

export default router;
