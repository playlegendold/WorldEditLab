import {
  sendErrorNotification,
  sendNotification,
  sendSuccessNotification
} from './shared/notification';
import { openModal } from './modal';
import { api } from './shared/api';
import { registerDragAndDrop } from './shared/dragAndDrop';

const handleSchematicUpload = (file, name, access, category, modal) => {
  const formData = new FormData();
  formData.append('schematic', file, `${name}.${file.name.split('.').pop()}`);
  formData.append('access', access);
  formData.append('category', category);

  api({
    method: 'POST',
    path: '/schematics'
  }, (res, err) => {
    if (res.status === 200) {
      sendSuccessNotification('Successfully uploaded');
      modal.close();
      collectionSchematic.addItem(JSON.parse(res.data).row);
    } else {
      sendErrorNotification(`Upload failed: ${JSON.parse(res.data).message}`);
    }
  }, formData);
};

const onClickUpload = (modal, event) => {
  let failed = false;
  modal.name.style.background = null;
  if (modal.file.style) {
    modal.file.style.background = null;

    if (modal.file.files.length === 0) {
      modal.file.style.background = '#ffc1c1';
      failed = true;
    } else if (modal.file.files[0].size >= 5 * 1024 * 1024) {
      modal.file.style.background = '#ffc1c1';
      failed = true;
    }
  }

  if (modal.name.value.length <= 3) {
    modal.name.style.background = '#ffc1c1';
    failed = true;
  }
  if (failed)
    return;
  const access = parseInt(modal.access.value);
  const category = parseInt(modal.category.value);
  sendNotification('Upload started...', 'info', 2000);
  handleSchematicUpload(modal.file.files[0], modal.name.value, access, category, modal);
};

const buildModalOptions = (categories, onclick, currentData, hideFileInput = false) => {
  const accessOptions = currentData === null ?
    `<option value="0">Public</option>
     <option value="1" selected>Internal</option>
     <option value="2">Private</option>` :
    `<option value="0" ${currentData.access === 0 ? 'selected' : ''}>Public</option>
     <option value="1" ${currentData.access === 1 ? 'selected' : ''}>Internal</option>
     <option value="2" ${currentData.access === 2 ? 'selected' : ''}>Private</option>`;

  let categoriesDom = '<option value="-1">-</option>';
  categoriesDom += categories.map((category) => {
    if (currentData === null) {
      return `<option value="${category.id}">${category.name}</option>`;
    }
    return `<option value="${category.id}" ${currentData.category === category.id ? 'selected' : ''}>${category.name}</option>`;
  });

  const options = {
    title: currentData ? 'Schematic' : 'Upload new schematic',
    content: [
      {
        type: 'label',
        attr: {
          innerText: 'Name',
        },
      },
      {
        key: 'name',
        type: 'input',
        attr: {
          maxLength: 32,
          placeholder: 'Schematic name',
          value: currentData ? currentData.name : '',
        },
      },
      {
        type: 'label',
        attr: {
          innerText: 'Category',
        },
      },
      {
        key: 'category',
        type: 'select',
        attr: {
          innerHTML: categoriesDom
        },
      },
      {
        type: 'label',
        attr: {
          innerText: 'Access',
        },
      },
      {
        key: 'access',
        type: 'select',
        attr: {
          innerHTML: accessOptions
        },
      }
    ],
    buttons: [
      {
        name: 'Cancel',
        click: 'close',
      },
      {
        name: currentData ? 'Save' : 'Upload',
        primary: true,
        click: onclick,
      },
    ],
  };

  if (currentData == null && !hideFileInput) {
    options.content.push({
      type: 'label',
      attr: {
        innerText: 'Schematic file',
      },
    }, {
      key: 'file',
      type: 'input',
      attr: {
        type: 'file',
        accept: '.schem,.schematic',
      },
    });
  }
  return options;
};

export const openSchematicUploadModal = (categories) => {
  openModal(buildModalOptions(categories, onClickUpload, null));
};

export const openSchematicEditModal = (infoJSON, categories) => {
  const info = JSON.parse(infoJSON);
  openModal(buildModalOptions(categories, (modal, event) => {
    let failed = false;
    modal.name.style.background = null;

    if (modal.name.value.length <= 3 || modal.name.value.length > 32) {
      modal.name.style.background = '#ffc1c1';
      failed = true;
    }
    if (failed)
      return;

    const patch = {
      name: modal.name.value,
      access: parseInt(modal.access.value),
      category: parseInt(modal.category.value),
    };

    api({
      method: 'PUT',
      path: `/schematics/${info.uuid}`,
      contentType: 'application/json',
    }, (res, err) => {
      if (res.status === 200) {
        const result = JSON.parse(res.data);
        if (result.success) {
          sendSuccessNotification('Schematic successfully updated!');
          collectionSchematic.updateItem({
            uuid: info.uuid,
            name: patch.name,
            access: patch.access,
            category: patch.category,
          });
          modal.close();
        } else {
          sendErrorNotification('Schematic update failed! ' + result.message);
        }
      } else {
        sendErrorNotification(`Request Error: ${res.status} ${res.statusText}`);
      }
    }, JSON.stringify(patch));
  }, info));
};

export const updateSchematicAccess = (row, access) => {
  const patch = {
    name: row.name,
    access: access,
    category: row.category,
  };

  console.log(row);
  console.log(access);
  api({
    method: 'PUT',
    path: `/schematics/${row.uuid}`,
    contentType: 'application/json',
  }, (res, err) => {
    if (res.status === 200) {
      const result = JSON.parse(res.data);
      if (result.success) {
        sendSuccessNotification('Schematic successfully updated!');
        collectionSchematic.updateItem({
          uuid: row.uuid,
          access: patch.access,
        });
      } else {
        sendErrorNotification('Schematic update failed! ' + result.message);
      }
    } else {
      sendErrorNotification(`Request Error: ${res.status} ${res.statusText}`);
    }
  }, JSON.stringify(patch));
};

export const deleteSchematic = (uuid) => {
  api({
    method: 'DELETE',
    path: `/schematics/${uuid}`,
  }, (res, err) => {
    if (res.status === 200) {
      const result = JSON.parse(res.data);
      if (result.success) {
        sendSuccessNotification('Schematic successfully deleted!');
        collectionSchematic.deleteItem(uuid);
      } else {
        sendErrorNotification('Schematic deletion failed! ' + result.message);
      }
    }
  });
};

export const registerDragAndDropOnSchematicTable = (collectionDOM, categories) => {
  registerDragAndDrop(collectionDOM, (event) => {
    const files = event.dataTransfer.files;
    if (files[0].size >= 5 * 1024 * 1024) {
      sendNotification('File is too big', 'error', 4000);
      return;
    }

    if (!(files[0].name.endsWith('.schematic') || files[0].name.endsWith('.schem'))) {
      sendNotification('Invalid file type', 'error', 4000);
      return;
    }

    openModal(buildModalOptions(categories, (modal, event) => {
      modal.file = { files };
      onClickUpload(modal, event);
    }, null, true))
  });
};

export default {
  create: openSchematicUploadModal,
  delete: deleteSchematic,
  edit: openSchematicEditModal,
  editAccess: updateSchematicAccess,
  dragDrop: registerDragAndDropOnSchematicTable,
};
