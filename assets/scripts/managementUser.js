import { openModal } from './modal';
import { sendNotification } from './notification';

const sendUserCreateRequest = ({name, role}, onFinished, onFail = null, onProgress = null) => {
  const request = new XMLHttpRequest();
  request.open('POST', '/management/users');
  request.onload = onFinished;
  request.onerror = onFail;
  request.onabort = onFail;
  request.onprogress = onProgress;
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(JSON.stringify({name, role}));
};

export const deleteUser = (id) => {
  const request = new XMLHttpRequest();
  request.open('DELETE', `/management/users/${id}`);
  request.onload = (event) => {
    if (request.status === 200) {
      const result = JSON.parse(request.response);
      if (result.success) {
        sendNotification('User successfully deleted!', 'success', 2000);
        collectionUsers.deleteItem(id);
      } else {
        sendNotification('User deletion failed! ' + result.message, 'error', 4000);
      }
    } else {
      sendNotification('Error: ' + request.statusText, 'error', 4000);
    }
  };
  request.send();
};

export const resetPasswordFromUser = (id) => {
  const request = new XMLHttpRequest();
  request.open('GET', `/management/users/${id}/pw-reset`);
  request.onload = (event) => {
    if (request.status === 200) {
      const result = JSON.parse(request.response);
      if (result.success) {
        sendNotification('User password was reset!', 'success', 2000);
        collectionUsers.updateItem(result.row);
      } else {
        sendNotification('User password reset failed! ' + result.message, 'error', 4000);
      }
    } else {
      sendNotification('Error: ' + request.statusText, 'error', 4000);
    }
  };
  request.send();
};

export const openUserCreateModal = () => {
  const roleOptions = `<option value="1" selected>User</option>
    <option value="2">Admin</option>`;

  openModal({
    title: 'Create New User',
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
          placeholder: 'User name',
        },
      },
      {
        type: 'label',
        attr: {
          innerText: 'Role',
        },
      },
      {
        key: 'role',
        type: 'select',
        attr: {
          innerHTML: roleOptions
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

          const role = parseInt(modal.role.value);
          sendUserCreateRequest({
            name: modal.name.value,
            role: role,
          }, (event) => {
            if (event.target.status === 200) {
              sendNotification(
                'Successfully created',
                'success',
                1000);
              modal.close();
              collectionUsers.addItem(JSON.parse(event.target.response).row);
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

export const openUserEditModal = (infoJSON) => {
  const info = JSON.parse(infoJSON);

  const roleOptions = `<option value="1" ${info.role === 1 ? 'selected' : ''}>User</option>
    <option value="2" ${info.role === 2 ? 'selected' : ''}>Admin</option>`;

  openModal({
    title: 'User',
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
      {
        type: 'label',
        attr: {
          innerText: 'Role',
        },
      },
      {
        key: 'role',
        type: 'select',
        attr: {
          innerHTML: roleOptions
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

          const role = parseInt(modal.role.value);

          const request = new XMLHttpRequest();
          request.open('PUT', `/management/users/${info.id}`);
          request.setRequestHeader('Content-Type', 'application/json');
          request.onload = (event) => {
            if (request.status === 200) {
              const result = JSON.parse(request.response);
              if (result.success) {
                sendNotification('User successfully updated!', 'success', 2000);
                collectionUsers.updateItem({
                  id: info.id,
                  name: modal.name.value,
                  role,
                });
                modal.close();
              } else {
                sendNotification('User update failed! ' + result.message, 'error', 4000);
              }
            } else {
              sendNotification(`Request Error: ${request.status} ${request.statusText}`, 'error', 4000);
            }
          };
          request.send(JSON.stringify({
            name: modal.name.value,
            role,
          }));
        },
      },
    ],
  });
};
