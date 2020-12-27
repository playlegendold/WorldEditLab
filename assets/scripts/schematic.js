import { sendNotification } from './notification';
import { openModal } from './modal';

const uploadNewSchematic = ({ file, name }, onFinished, onFail = null, onProgress = null) => {
  const request = new XMLHttpRequest();
  request.open('POST', '/schematics');
  request.onload = onFinished;
  request.onerror = onFail;
  request.onabort = onFail;
  request.onprogress = onProgress;
  const formData = new FormData();
  formData.append('schematic', file, `${name}.${file.name.split('.').pop()}`);
  request.send(formData);
}

export const openSchematicUploadModal = () => {
  openModal({
    title: 'Upload new schematic',
    content: [
      {
        key: 'name',
        type: 'input',
        attr: {
          maxLength: 32,
          placeholder: 'Schematic name',
        },
      },
      {
        key: 'file',
        type: 'input',
        attr: {
          type: 'file',
          accept: '.schem,.schematic',
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
          sendNotification('Upload started...');
          uploadNewSchematic({
            file: modal.file.files[0],
            name: modal.name.value,
          }, (event) => {
            if (event.target.status === 200) {
              sendNotification(
                'Successfully uploaded',
                'success',
                2000);
              modal.close();
              tableSchematic.addRow(JSON.parse(event.target.response).row);
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
        },
      },
    ],
  });
};

export const deleteSchematic = (uuid) => {
  const request = new XMLHttpRequest();
  request.open('DELETE', `/schematics/${uuid}`);
  request.onload = (event) => {
    const result = JSON.parse(request.response);
    if (result.success) {
      sendNotification('Schematic successfully deleted!', 'success', 2000);
      tableSchematic.deleteRow(uuid);
    } else {
      sendNotification('Schematic deletion failed! ' + result.message, 'error', 4000);
    }
  };
  request.send();
};
