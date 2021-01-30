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
import { newCollection } from './collection';
import {
  openCategoryCreateModal,
  deleteCategory,
  openCategoryEditModal,
} from './managementCategory';
import {
  deleteUser,
  openUserCreateModal,
  openUserEditModal,
  resetPasswordFromUser,
} from './managementUser';

global.WEL = {
  openSchematicUploadModal,
  openCategoryCreateModal,
  openUserCreateModal,
  openSchematicEditModal,
  openCategoryEditModal,
  openUserEditModal,
  updateSchematicAccess,
  deleteSchematic,
  deleteCategory,
  deleteUser,
  resetPasswordFromUser,
  copyToClipboard,
  sendNotification,
  openConfirmModal,
  newCollection,
  registerDragAndDropOnSchematicTable,
};
