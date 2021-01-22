import {openModal} from "./modal";
import {sendNotification} from "./notification";

const sendCategoryCreateRequest = (name, onFinished, onFail = null, onProgress = null) => {
  const request = new XMLHttpRequest();
  request.open('POST', '/management/schematic-categories');
  request.onload = onFinished;
  request.onerror = onFail;
  request.onabort = onFail;
  request.onprogress = onProgress;
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(JSON.stringify({name}));
};

export const deleteSchematicCategory = (id) => {
  const request = new XMLHttpRequest();
  request.open('DELETE', `/management/schematic-categories/${id}`);
  request.onload = (event) => {
    if (request.status === 200) {
      const result = JSON.parse(request.response);
      if (result.success) {
        sendNotification('Schematic category successfully deleted!', 'success', 2000);
        tableCategories.deleteRow(id);
      } else {
        sendNotification('Schematic category deletion failed! ' + result.message, 'error', 4000);
      }
    } else {
      sendNotification('Error: ' + request.statusText, 'error', 4000);
    }
  };
  request.send();
};

export const openSchematicCategoryCreateModal = () => {
  openModal({
    title: 'Create New Category',
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
          placeholder: 'Category name',
        },
      },
    ],
    buttons: [
      {
        name: 'Cancel',
        click: 'close',
      },
      {
        name: 'Create',
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

          sendCategoryCreateRequest(modal.name.value, (event) => {
            if (event.target.status === 200) {
              sendNotification(
                'Successfully created',
                'success',
                1000);
              modal.close();
              tableCategories.addRow(JSON.parse(event.target.response).row);
            } else {
              sendNotification(
                `Creation failed: ${JSON.parse(event.target.response).message}`,
                'error');
            }
          }, () => {
            sendNotification(
              'Creation failed: Connection aborted!',
              'error');
          });
        },
      },
    ],
  });
};

export const openSchematicCategoryEditModal = (infoJSON) => {
  const info = JSON.parse(infoJSON);
  openModal({
    title: 'Category',
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
          placeholder: 'Category name',
          value: info.name,
        },
      },
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

          const request = new XMLHttpRequest();
          request.open('PUT', `/management/schematic-categories/${info.id}`);
          request.setRequestHeader('Content-Type', 'application/json');
          request.onload = (event) => {
            if (request.status === 200) {
              const result = JSON.parse(request.response);
              if (result.success) {
                sendNotification('Category successfully updated!', 'success', 2000);
                tableCategories.updateRow({
                  id: info.id,
                  name: modal.name.value,
                });
                modal.close();
              } else {
                sendNotification('Category update failed! ' + result.message, 'error', 4000);
              }
            } else {
              sendNotification(`Request Error: ${request.status} ${request.statusText}`, 'error', 4000);
            }
          };
          request.send(JSON.stringify({
            name: modal.name.value,
          }));
        },
      },
    ],
  });
};
