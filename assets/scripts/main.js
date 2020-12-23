import { sendNotification } from './notification';
import { copyToClipboard } from './clipboard';
import { openSchematicUploadModal } from './schematicModal';

global.WEL = {
  openSchematicUploadModal,
  copyToClipboard,
  sendNotification,
};
