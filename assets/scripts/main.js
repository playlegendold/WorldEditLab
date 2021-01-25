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
} from './managementCategory';
import {
  deleteUser,
  openUserCreateModal,
  openUserEditModal,
  resetPasswordFromUser,
} from './managementUser';

global.WEL = {
  openSchematicUploadModal,
  openSchematicCategoryCreateModal,
  openUserCreateModal,
  openSchematicEditModal,
  openSchematicCategoryEditModal,
  openUserEditModal,
  updateSchematicAccess,
  deleteSchematic,
  deleteSchematicCategory,
  deleteUser,
  resetPasswordFromUser,
  copyToClipboard,
  sendNotification,
  openConfirmModal,
  newTable,
  registerDragAndDropOnSchematicTable,
};
