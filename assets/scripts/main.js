import { sendNotification } from './shared/notification';
import { copyToClipboard } from './shared/clipboard';
import { openConfirmModal } from './defaultModals';
import { newCollection } from './collection';
import schematics from './schematic';
import categories from './managementCategory';
import users from './managementUser';
import heightmaps from './heightmap';

global.WEL = {
  copyToClipboard,
  sendNotification,
  openConfirmModal,
  newCollection,
  schematics,
  categories,
  users,
  heightmaps,
};
