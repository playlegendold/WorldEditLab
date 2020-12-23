import { sendNotification } from './notification';
import { copyToClipboard } from './clipboard';
import { registerSchematicModal } from './schematicModal';

global.WEL = {
  registerSchematicModal,
  copyToClipboard,
  sendNotification,
};
