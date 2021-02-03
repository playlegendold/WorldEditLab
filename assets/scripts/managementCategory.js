import { openModal } from './modal';
import { sendErrorNotification, sendSuccessNotification } from './shared/notification';
import { api } from './shared/api';

export const deleteCategory = (id, type) => {
  api({
    method: 'DELETE',
    path: `/management/${type}-categories/${id}`,
  }, (res, err) => {
    if (res.status === 200) {
      const result = JSON.parse(res.data);
      if (result.success) {
        sendSuccessNotification('Schematic category successfully deleted!');
        collectionCategories.deleteItem(id);
      } else {
        sendErrorNotification('Schematic category deletion failed! ' + result.message);
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

export const openCategoryCreateModal = (type) => {
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
          if (!isValid(modal))
            return;

          api({
            method: 'POST',
            path: `/management/${type}-categories`,
            contentType: 'application/json'
          }, (res, err) => {
            if (res.status === 200) {
              sendSuccessNotification('Successfully created');
              modal.close();
              collectionCategories.addItem(JSON.parse(res.data).row);
            } else {
              sendErrorNotification(`Creation failed: ${JSON.parse(res.data).message}`);
            }
          }, JSON.stringify({ name: modal.name.value }));
        },
      },
    ],
  });
};

export const openCategoryEditModal = (infoJSON, type) => {
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
          if (!isValid(modal))
            return;

          api({
            method: 'PUT',
            path: `/management/${type}-categories/${info.id}`,
            contentType: 'application/json',
          }, (res, err) => {
            if (res.status === 200) {
              const result = JSON.parse(res.data);
              if (result.success) {
                sendSuccessNotification('Category successfully updated!');
                collectionCategories.updateItem({
                  id: info.id,
                  name: modal.name.value,
                });
                modal.close();
              } else {
                sendErrorNotification('Category update failed! ' + result.message);
              }
            } else {
              sendErrorNotification(`Request Error: ${res.status} ${res.statusText}`);
            }
          }, JSON.stringify({
            name: modal.name.value,
          }));
        },
      },
    ],
  });
};
