const WEL = (() => {

  const uploadNewSchematic = ({ file, name }, onFinished, onFail = null, onProgress = null) => {
    const request = new XMLHttpRequest();
    request.open('POST', '/schematics');
    request.onload = onFinished;
    request.onerror = onFail;
    request.onabort = onFail;
    request.onprogress = onProgress;
    const formData = new FormData();
    formData.append('schematic', file, name);
    request.send(formData);
  }

  const registerSchematicModal = () => {
    const modalTitle = document.querySelector('.modal-head > p');
    modalTitle.innerText = 'Upload new schematic';

    const inputName = document.createElement('input');
    inputName.type = 'text';
    inputName.maxLength = 32;
    inputName.placeholder = 'Schematic name';
    document.querySelector('.modal-body').append(inputName);

    const inputFile = document.createElement('input');
    inputFile.type = 'file';
    inputFile.accept = '.schem,.schematic';
    document.querySelector('.modal-body').append(inputFile);

    const toggleModal = () => {
      inputFile.style.background = null;
      inputFile.files = null;
      inputName.style.background = null;
      inputName.value = '';
      const body = document.querySelector('body');
      const modal = document.querySelector('.modal');
      modal.classList.toggle('open');
      body.classList.toggle('modal-active');
    };

    const modalFoot = document.querySelector('.modal-foot');

    const uploadButton = document.createElement('button');
    uploadButton.className = 'modal-btn-prime';
    uploadButton.innerText = 'Upload';
    uploadButton.addEventListener('click', () => {
      let failed = false;

      inputFile.style.background = null;
      inputName.style.background = null;

      if (inputFile.files.length === 0) {
        inputFile.style.background = '#ffc1c1';
        failed = true;
      } else if (inputFile.files[0].size >= 5 * 1024 * 1024) {
        inputFile.style.background = '#ffc1c1';
        failed = true;
      }

      if (inputName.value.length <= 3) {
        inputName.style.background = '#ffc1c1';
        failed = true;
      }

      if (failed) return;

      sendNotification('Upload started...');
      uploadNewSchematic({
        file: inputFile.files[0],
        name: inputName.value,
      }, (event) => {
        if (event.target.status === 200) {
          toggleModal();
          window.location.reload();
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
    });

    const cancelButton = document.createElement('button');
    cancelButton.className = 'modal-btn';
    cancelButton.innerText = 'Cancel';
    cancelButton.addEventListener('click', toggleModal);

    modalFoot.append(cancelButton, uploadButton);

    const overlay = document.querySelector('.modal-overlay');
    overlay.addEventListener('click', toggleModal);

    const openers = document.querySelectorAll('.modal-open');
    openers.forEach((opener) => {
      opener.addEventListener('click', (event) => {
        event.preventDefault();
        toggleModal();
      });
    });
  };

  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        sendNotification('Copied!', 'success', 1000);
      } else {
        console.error('Fallback: Copy command failed')
      }
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
  }

  const copyToClipboard = (text) => {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(function() {
      sendNotification('Copied!', 'success', 1000);
    }, function(err) {
      console.error('Async: Could not copy text: ', err);
    });
  };

  const sendNotification = (message, status, duration) => {
    let icon = '';
    switch (status) {
      case 'success':
        icon = 'fa-check';
        break;
      case 'error':
        icon = 'fa-times';
        break;
      case 'warning':
        icon = 'fa-exclamation';
        break;
      case 'info':
      default:
        icon = 'fa-info';
    }

    const notification = document.createElement('div');
    notification.className = `notification ${status ? status : 'info'}`;

    const notificationIconBox = document.createElement('div');
    notificationIconBox.className = 'notification-icon';
    const notificationIcon = document.createElement('i');
    notificationIcon.className = `fas ${icon}`;
    notificationIconBox.append(notificationIcon);
    notification.append(notificationIconBox);

    const notificationContent = document.createElement('div');
    notificationContent.className = 'notification-content';
    notificationContent.innerText = message;
    notification.append(notificationContent);

    document.querySelector('.notification-box').append(notification);
    setTimeout(() => {
      notification.remove();
    }, duration ? duration : 6000);
  };

  return {
    registerSchematicModal,
    copyToClipboard,
    sendNotification,
  };
})();
