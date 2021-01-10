import { sendNotification } from './notification';
import { copyToClipboard } from './clipboard';
import { openSchematicUploadModal, deleteSchematic, openSchematicEditModal } from './schematic';
import { openConfirmModal } from './defaultModals';
import { newTable } from './table';

global.WEL = {
  openSchematicUploadModal,
  openSchematicEditModal,
  copyToClipboard,
  sendNotification,
  openConfirmModal,
  deleteSchematic,
  newTable,
};
