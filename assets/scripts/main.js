import { sendNotification } from './notification';
import { copyToClipboard } from './clipboard';
import { openSchematicUploadModal, deleteSchematic } from './schematic';
import { openConfirmModal } from './defaultModals';

global.WEL = {
  openSchematicUploadModal,
  copyToClipboard,
  sendNotification,
  openConfirmModal,
  deleteSchematic,
};
