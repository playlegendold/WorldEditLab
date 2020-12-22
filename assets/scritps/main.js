const WEL = (() => {

  const uploadNewSchematic = (file, onSuccess, onFail, onProgress) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const request = new XMLHttpRequest();
      request.onload = onSuccess;
      request.onerror = onFail;
      request.onabort = onFail;
      request.onprogress = onProgress;
      request.open('POST', '/schematics');
      request.send(e.target.result);
    };
    reader.readAsBinaryString(file);
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

    const input = document.createElement('input');
    input.type = 'file';
    document.querySelector('.modal-body').append(input);

    const modalFoot = document.querySelector('.modal-foot');

    const uploadButton = document.createElement('button');
    uploadButton.className = 'modal-btn-prime';
    uploadButton.innerText = 'Upload';
    uploadButton.addEventListener('click', () => {
      console.log(input.files);
      uploadNewSchematic(input.files[0], () => {
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
