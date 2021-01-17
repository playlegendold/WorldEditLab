import { openModal } from './modal';

export const openConfirmModal = (question, callbackIfOK) => {
  openModal({
    title: question,
    content: [],
    buttons: [
      {
        name: 'Cancel',
        click: 'close',
      },
      {
        name: 'Yes',
        primary: true,
        click: (modal) => {
          callbackIfOK();
          modal.close();
        },
      },
    ],
  });
};
