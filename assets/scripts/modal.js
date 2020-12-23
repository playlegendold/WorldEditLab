const state = {
  container: null,
  currentModal: null,
};

const createModalHead = (title) => {
  const head = document.createElement('div');
  head.className = 'modal-head';

  const headTitle = document.createElement('p');
  headTitle.innerText = title;

  head.append(headTitle);
  return {
    dom: head,
    title: headTitle,
  };
};

const createModalBody = (options) => {
  const result = {
    dom: document.createElement('div'),
  };
  result.dom.className = 'modal-body';
  for (const item of options.content) {
    const element = document.createElement(item.type);
    for (const [key, value] of Object.entries(item.attr)) {
      element[key] = value;
    }
    result.dom.append(element);
    if (item.key) {
      result[item.key] = element;
    }
  }
  return result;
};

const createModalFoot = (options, modal) => {
  const { buttons } = options;
  const foot = document.createElement('div');
  foot.className = 'modal-foot'

  for (const button of buttons) {
    const buttonDOM = document.createElement('button');
    buttonDOM.className = button.primary ? 'modal-btn-prime' : 'modal-btn';
    buttonDOM.innerText = button.name;

    if (button.click) {
      if (button.click instanceof Function) {
        buttonDOM.addEventListener('click', (event) => button.click(modal, event));
      } else if (button.click === 'close') {
        buttonDOM.addEventListener('click', modal.close);
      }
    }

    foot.append(buttonDOM);
  }

  return foot;
};

const createCloseFunction = (modalDOM) => {
  return () => {
    const body = document.querySelector('body');
    const modal = document.querySelector('.modal');
    modal.classList.remove('open');
    body.classList.remove('modal-active');
    modalDOM.remove();
  }
}

export const openModal = (options) => {
  let modal = {};
  const modalDOM = document.createElement('div');
  modal.close = createCloseFunction(modalDOM);
  const head = createModalHead(options.title);
  modal.title = head.title;
  modalDOM.append(head.dom);

  const body = createModalBody(options);
  modalDOM.append(body.dom);
  modal = {...modal, ...body};
  modal.dom = modalDOM;

  modalDOM.append(createModalFoot(options, modal));
  state.container.append(modalDOM);
  state.currentModal = modal;

  state.show();
};

window.addEventListener('load', (event) => {
  state.container = document.querySelector('.modal-container');
  state.body = document.querySelector('body');
  state.modal = document.querySelector('.modal');

  const overlay = document.querySelector('.modal-overlay');
  overlay.addEventListener('click', () => {
    if (state.currentModal)
      state.currentModal.close();
  });
  state.show = () => {
    state.modal.classList.add('open');
    state.body.classList.add('modal-active');
  };
});
