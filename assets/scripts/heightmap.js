import {sendNotification} from "./notification";
import {openModal} from "./modal";

const uploadNewHeightmap = ({file, name, access, category}, onFinished, onFail = null, onProgress = null) => {
  const request = new XMLHttpRequest();
  request.open('POST', '/heightmaps');
  request.onload = onFinished;
  request.onerror = onFail;
  request.onabort = onFail;
  request.onprogress = onProgress;
  const formData = new FormData();
  formData.append('heightmap', file, name);
  formData.append('access', access);
  formData.append('category', category);
  request.send(formData);
}

const handleHeightmapUpload = (file, name, access, category, modal) => {
  uploadNewHeightmap({
    file,
    name,
    access,
    category,
  }, (event) => {
    if (event.target.status === 200) {
      sendNotification(
        'Successfully uploaded',
        'success',
        2000);
      modal.close();
      gridHeightmaps.addItem(JSON.parse(event.target.response).row);
    } else {
      sendNotification(
        `Upload failed: ${JSON.parse(event.target.response).message}`,
        'error');
    }
  }, () => {
    sendNotification(
      'Upload failed: Connection aborted!',
      'error');
  });
};

export const openHeightmapUploadModal = (categories) => {
  const accessOptions = `<option value="0">Public</option>
    <option value="1" selected>Internal</option>
    <option value="2">Private</option>`;

  let categoriesDom = '<option value="-1">-</option>';
  categoriesDom += categories.map((category) => {
    return `<option value="${category.id}">${category.name}</option>`;
  });

  openModal({
    title: 'Upload new heightmap',
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
      {
        type: 'label',
        attr: {
          innerText: 'Heightmap file',
        },
      },
      {
        key: 'file',
        type: 'input',
        attr: {
          type: 'file',
          accept: '.png',
        },
      }
    ],
    buttons: [
      {
        name: 'Cancel',
        click: 'close',
      },
      {
        name: 'Upload',
        primary: true,
        click: (modal, event) => {
          let failed = false;
          modal.name.style.background = null;
          modal.file.style.background = null;

          if (modal.file.files.length === 0) {
            modal.file.style.background = '#ffc1c1';
            failed = true;
          } else if (modal.file.files[0].size >= 5 * 1024 * 1024) {
            modal.file.style.background = '#ffc1c1';
            failed = true;
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
        },
      },
    ],
  });
};

export const deleteHeightmap = (uuid) => {
  const request = new XMLHttpRequest();
  request.open('DELETE', `/heightmaps/${uuid}`);
  request.onload = (event) => {
    if (request.status === 200) {
      const result = JSON.parse(request.response);
      if (result.success) {
        sendNotification('Heightmap successfully deleted!', 'success', 2000);
        gridHeightmaps.deleteItem(uuid);
      } else {
        sendNotification('Heightmap deletion failed! ' + result.message, 'error', 4000);
      }
    } else {
      sendNotification('Error: ' + request.statusText, 'error', 4000);
    }
  };
  request.send();
};

export const openHeightmapEditModal = (infoJSON, categories) => {
  const info = JSON.parse(infoJSON);
  const accessOptions = `<option value="0" ${info.access === 0 ? 'selected' : ''}>Public</option>
    <option value="1" ${info.access === 1 ? 'selected' : ''}>Internal</option>
    <option value="2" ${info.access === 2 ? 'selected' : ''}>Private</option>`;

  let categoriesDom = '<option value="-1">-</option>';
  categoriesDom += categories.map((category) => {
    return `<option value="${category.id}" ${info.category === category.id ? 'selected' : ''}>${category.name}</option>`;
  });

  openModal({
    title: 'Heightmap',
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
          placeholder: 'Name',
          value: info.name
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
          innerHTML: accessOptions,
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
          innerHTML: categoriesDom,
        },
      }
    ],
    buttons: [
      {
        name: 'Cancel',
        click: 'close',
      },
      {
        name: 'Save',
        primary: true,
        click: (modal, event) => {
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

          const request = new XMLHttpRequest();
          request.open('PUT', `/heightmaps/${info.uuid}`);
          request.setRequestHeader('Content-Type', 'application/json');
          request.onload = (event) => {
            if (request.status === 200) {
              const result = JSON.parse(request.response);
              if (result.success) {
                sendNotification('Heightmap successfully updated!', 'success', 2000);
                gridHeightmaps.updateItem({
                  uuid: info.uuid,
                  name: patch.name,
                  access: patch.access,
                  category: patch.category,
                });
                modal.close();
              } else {
                sendNotification('Heightmap update failed! ' + result.message, 'error', 4000);
              }
            } else {
              sendNotification(`Request Error: ${request.status} ${request.statusText}`, 'error', 4000);
            }
          };
          request.send(JSON.stringify(patch));
        },
      },
    ],
  });
};
