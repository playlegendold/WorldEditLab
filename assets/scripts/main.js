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
import {
  openHeightmapUploadModal,
  openHeightmapEditModal,
  deleteHeightmap,
} from './heightmap';

global.WEL = {
  openSchematicUploadModal,
  openCategoryCreateModal,
  openHeightmapUploadModal,
  openUserCreateModal,
  openSchematicEditModal,
  openCategoryEditModal,
  openUserEditModal,
  openHeightmapEditModal,
  updateSchematicAccess,
  deleteSchematic,
  deleteHeightmap,
  deleteCategory,
  deleteUser,
  resetPasswordFromUser,
  copyToClipboard,
  sendNotification,
  openConfirmModal,
  newCollection,
  registerDragAndDropOnSchematicTable,
};
