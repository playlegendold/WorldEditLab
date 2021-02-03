import { openModal } from './modal';
import { sendErrorNotification, sendSuccessNotification } from './shared/notification';
import { api } from './shared/api';

export const deleteUser = (id) => {
  api({
    method: 'DELETE',
    path: `/management/users/${id}`,
  }, (res, err) => {
    if (res.status === 200) {
      const result = JSON.parse(res.data);
      if (result.success) {
        sendSuccessNotification('User successfully deleted!');
        collectionUsers.deleteItem(id);
      } else {
        sendErrorNotification('User deletion failed! ' + result.message);
      }
    } else {
      sendErrorNotification('Error: ' + res.statusText);
    }
  });
};

export const resetPasswordFromUser = (id) => {
  api({
    method: 'GET',
    path: `/management/users/${id}/pw-reset`,
  }, (res, err) => {
    if (res.status === 200) {
      const result = JSON.parse(res.data);
      if (result.success) {
        sendSuccessNotification('User password was reset!');
        collectionUsers.updateItem(result.row);
      } else {
        sendErrorNotification('User password reset failed! ' + result.message);
      }
    } else {
      sendErrorNotification('Error: ' + res.statusText);
    }
  });
};

const isValid = (modal) => {
  modal.name.style.background = null;

  if (modal.name.value.length <= 3 || modal.name.value.length > 32) {
    modal.name.style.background = '#ffc1c1';
    return false;
  }

  return true;
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
          if (!isValid(modal))
            return;

          const role = parseInt(modal.role.value);

          api({
            method: 'POST',
            path: '/management/users',
            contentType: 'application/json',
          }, (res, err) => {
            if (res.status === 200) {
              sendSuccessNotification('Successfully created');
              modal.close();
              collectionUsers.addItem(JSON.parse(res.data).row);
            } else {
              sendErrorNotification(`Creation failed: ${JSON.parse(event.target.response).message}`);
            }
          }, JSON.stringify({name: modal.name.value, role}));
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
          if (!isValid(modal))
            return;

          const role = parseInt(modal.role.value);

          api({
            method: 'PUT',
            path: `/management/users/${info.id}`,
            contentType: 'application/json',
          }, (res, err) => {
            if (res.status === 200) {
              const result = JSON.parse(res.data);
              if (result.success) {
                sendSuccessNotification('User successfully updated!');
                collectionUsers.updateItem({
                  id: info.id,
                  name: modal.name.value,
                  role,
                });
                modal.close();
              } else {
                sendErrorNotification('User update failed! ' + result.message);
              }
            } else {
              sendErrorNotification('Error: ' + res.statusText);
            }
          }, JSON.stringify({
            name: modal.name.value,
            role,
          }));
        },
      },
    ],
  });
};
