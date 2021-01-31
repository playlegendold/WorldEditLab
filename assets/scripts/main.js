import { sendNotification } from './shared/notification';
import { copyToClipboard } from './shared/clipboard';
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
  registerDragAndDropOnHeightmapCollection,
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
  registerDragAndDropOnHeightmapCollection,
};
