import { Router } from 'express';
import { handleIndexView } from './view';
import { handleIndexUpload } from './upload';
import { handleDeleteRequest } from './delete';
import { handleEditRequest } from './edit';
import { handleFAWECustomDownload, handleFAWEDirectDownload, handleFAWEUpload } from './fawe';
import { asyncHandler } from '../../shared/helpers/errorHandler';

export default () => {
  const router = Router();
  router.get('/', asyncHandler(handleIndexView));
  router.post('/', asyncHandler(handleIndexUpload));
  router.put('/:uuid', asyncHandler(handleEditRequest));
  router.delete('/:uuid', asyncHandler(handleDeleteRequest));

  if (process.env.FAWE_USER_ID && process.env.FAWE_UPLOAD_ACCESS) {
    router.get('/fawe/', asyncHandler(handleFAWEDirectDownload));
    router.post('/fawe/save.php', asyncHandler(handleFAWEUpload));
    router.post('/fawe/upload.php', asyncHandler(handleFAWEUpload));
    router.get('/fawe/uploads/:id', asyncHandler(handleFAWECustomDownload));
    console.log('Enabled FAWE compatibility mode.');
  }

  return router;
};
