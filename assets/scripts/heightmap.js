import {
  sendErrorNotification,
  sendNotification,
  sendSuccessNotification
} from './shared/notification';
import { openModal } from './modal';
import { api } from './shared/api';
import { registerDragAndDrop } from './shared/dragAndDrop';

const handleHeightmapUpload = (file, name, access, category, modal) => {
  const formData = new FormData();
  formData.append('heightmap', file, name);
  formData.append('access', access);
  formData.append('category', category);
  api({
    method: 'POST',
    path: '/heightmaps'
  }, (res, err) => {
    if (err != null) {
      sendErrorNotification(`Upload failed: ${JSON.parse(res._event.target.response).message}`);
      return;
    }

    if (res.status === 200) {
      sendSuccessNotification('Successfully uploaded');
      modal.close();
      collectionHeightmaps.addItem(JSON.parse(res.data).row);
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
  handleHeightmapUpload(modal.file.files[0], modal.name.value, access, category, modal);
}

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
    title: currentData ? 'Heightmap' : 'Upload new heightmap',
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
          placeholder: 'Heightmap name',
          value: currentData ? currentData.name : '',
        },
      },
      {
        type: 'label',
        attr: {
          innerText: 'Heightmap',
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
      },
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
      }
    ],
  };
  if (currentData === null && !hideFileInput) {
    options.content.push(
      {
        type: 'label',
        attr: {
          innerText: 'Heightmap file',
        },
      }, {
      key: 'file',
      type: 'input',
      attr: {
        type: 'file',
        accept: '.png',
      },
    });
  }
  return options;
};

export const openHeightmapUploadModal = (categories) => {
  openModal(buildModalOptions(categories, onClickUpload, null));
};

export const deleteHeightmap = (uuid) => {
  api({
    method: 'DELETE',
    path: `/heightmaps/${uuid}`,
  }, (res, err) => {
    if (res.status === 200) {
      const result = JSON.parse(res.data);
      if (result.success) {
        sendSuccessNotification('Heightmap successfully deleted!');
        collectionHeightmaps.deleteItem(uuid);
      } else {
        sendErrorNotification('Heightmap deletion failed! ' + result.message);
      }
    }
  });
};

export const openHeightmapEditModal = (infoJSON, categories) => {
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
      path: `/heightmaps/${info.uuid}`,
      contentType: 'application/json',
    }, (res, err) => {
      if (res.status === 200) {
        const result = JSON.parse(res.data);
        if (result.success) {
          sendSuccessNotification('Heightmap successfully updated!');
          collectionHeightmaps.updateItem({
            uuid: info.uuid,
            name: patch.name,
            access: patch.access,
            category: patch.category,
          });
          modal.close();
        } else {
          sendErrorNotification('Heightmap update failed! ' + result.message);
        }
      } else {
        sendErrorNotification(`Request Error: ${res.status} ${res.statusText}`);
      }
    }, JSON.stringify(patch));
  }, info));
};

export const registerDragAndDropOnHeightmapCollection = (collectionDOM, categories) => {
  registerDragAndDrop(collectionDOM, (event) => {
    const files = event.dataTransfer.files;

    if (files[0].size >= 5 * 1024 * 1024) {
      sendErrorNotification('File is too big');
      return;
    }

    if (!files[0].name.endsWith('.png')) {
      sendErrorNotification('Invalid file type');
      return;
    }
    openModal(buildModalOptions(categories, (modal, event) => {
      modal.file = { files };
      onClickUpload(modal, event);
    }, null, true));
  });
};
