export const registerDragAndDrop = (element, ondrop) => {
  const eventHandlerAddClass = (event) => {
    event.preventDefault();
    event.stopPropagation();
    element.classList.add('drag-drop');
  };
  element.addEventListener('dragenter', eventHandlerAddClass);
  element.addEventListener('dragover', eventHandlerAddClass);
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
