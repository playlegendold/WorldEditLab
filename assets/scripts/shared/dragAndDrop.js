export const registerDragAndDrop = (element, ondrop) => {
  element.addEventListener('dragenter', (event) => {
    event.preventDefault();
    event.stopPropagation();
    element.classList.add('drag-drop');
  });
  element.addEventListener('dragover', (event) => {
    event.preventDefault();
    event.stopPropagation();
    element.classList.add('drag-drop');
  });
  element.addEventListener('dragleave', (event) => {
    event.preventDefault();
    event.stopPropagation();
    element.classList.remove('drag-drop');
  });
  element.addEventListener('drop', (event) => {
    event.preventDefault();
    event.stopPropagation();
    element.classList.remove('drag-drop');
    ondrop(event);
  });
};
