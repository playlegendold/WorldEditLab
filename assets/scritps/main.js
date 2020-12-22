const WEL = (() => {

  const uploadNewSchematic = ({ file, name }, onSuccess, onFail, onProgress) => {
    const request = new XMLHttpRequest();
    request.open('POST', '/schematics');
    request.onload = onSuccess;
    request.onerror = onFail;
    request.onabort = onFail;
    request.onprogress = onProgress;
    const formData = new FormData();
    formData.append('schematic', file, name);
    request.send(formData);
  }

  const registerSchematicModal = () => {
    const toggleModal = () => {
      const body = document.querySelector('body');
      const modal = document.querySelector('.modal');
      modal.classList.toggle('open');
      body.classList.toggle('modal-active');
    };

    const modalTitle = document.querySelector('.modal-head > p');
    modalTitle.innerText = 'Upload new schematic';

    const inputName = document.createElement('input');
    inputName.type = 'text';
    inputName.maxLength = 32;
    inputName.placeholder = 'Schematic name';
    document.querySelector('.modal-body').append(inputName);

    const inputFile = document.createElement('input');
    inputFile.type = 'file';
    document.querySelector('.modal-body').append(inputFile);

    const modalFoot = document.querySelector('.modal-foot');

    const uploadButton = document.createElement('button');
    uploadButton.className = 'modal-btn-prime';
    uploadButton.innerText = 'Upload';
    uploadButton.addEventListener('click', () => {
      let failed = false;

      if (inputFile.files.length === 0) {
        inputFile.style.background = '#ffc1c1';
        failed = true;
      }

      if (inputName.value.length <= 3) {
        inputName.style.background = '#ffc1c1';
        failed = true;
      }

      if (failed) return;

      uploadNewSchematic({
        file: inputFile.files[0],
        name: inputName.value,
      }, () => {
        toggleModal();
        window.location.reload();
      }, () => {
        toggleModal();
        alert('Upload failed!');
      }, (event) => {
        console.log(`Uploaded ${event.loaded} of ${event.total} bytes`);
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

  return {
    registerSchematicModal,
  };
})();
