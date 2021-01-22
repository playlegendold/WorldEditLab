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
import {
  openSchematicCategoryCreateModal,
  deleteSchematicCategory,
  openSchematicCategoryEditModal,
} from './management';

global.WEL = {
  openSchematicUploadModal,
  openSchematicCategoryCreateModal,
  openSchematicEditModal,
  openSchematicCategoryEditModal,
  updateSchematicAccess,
  deleteSchematic,
  deleteSchematicCategory,
  copyToClipboard,
  sendNotification,
  openConfirmModal,
  newTable,
  registerDragAndDropOnSchematicTable,
};
