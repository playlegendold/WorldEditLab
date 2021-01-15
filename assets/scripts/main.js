import { sendNotification } from './notification';
import { copyToClipboard } from './clipboard';
import {
  openSchematicUploadModal,
  deleteSchematic,
  openSchematicEditModal,
  updateSchematicAccess,
  registerDragAndDropOnSchematicTable,
} from './schematic';
import { openConfirmModal } from './defaultModals';
import { newTable } from './table';

global.WEL = {
  openSchematicUploadModal,
  openSchematicEditModal,
  updateSchematicAccess,
  copyToClipboard,
  sendNotification,
  openConfirmModal,
  deleteSchematic,
  newTable,
  registerDragAndDropOnSchematicTable,
};
