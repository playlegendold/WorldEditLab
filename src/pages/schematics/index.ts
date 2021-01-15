import { Router } from 'express';
import { handleIndexView } from './view';
import { handleIndexUpload } from './upload';
import { handleDeleteRequest } from './delete';
import { handleEditRequest } from './edit';
import { handleFAWEDownload, handleFAWEUpload } from './fawe';

export default () => {
  const router = Router();
  router.get('/', handleIndexView);
  router.post('/', handleIndexUpload);
  router.put('/:uuid', handleEditRequest);
  router.delete('/:uuid', handleDeleteRequest);

  if (process.env.FAWE_USER_ID && process.env.FAWE_UPLOAD_ACCESS) {
    router.get('/fawe/', handleFAWEDownload);
    router.post('/fawe/save.php', handleFAWEUpload);
    router.post('/fawe/upload.php', handleFAWEUpload);
    console.log('Enabled FAWE compatibility mode.');
  }

  return router;
};
