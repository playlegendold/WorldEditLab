const TABLE = 'table';
const GRID = 'grid';

const createItem = (collection, setup, item) => {
  const columns = [];
  let dom = undefined;
  const checkbox = createCheckBox(collection.type === TABLE ? 'td' : 'div');

  if (collection.type === TABLE) {
    dom = document.createElement('tr');
    dom.append(checkbox.dom);

    setup.columns.forEach((column) => {
      const td = document.createElement('td');
      const span = document.createElement('span');
      if (column.key !== undefined) {
        span.innerHTML = item[column.key];
      } else if (column.func !== undefined) {
        span.innerHTML = column.func(item);
      }
      columns[column.title] = span;
      td.append(span);
      dom.append(td);
    });

    checkbox.input.addEventListener('change', () => {
      collection.updateSelectedCount(checkbox.input.checked ? 1 : -1);
    });
  } else if (collection.type === GRID) {
    dom = document.createElement('div');
    dom.className = 'card';

    setup.columns.forEach((column) => {
      const container = document.createElement('div');
      container.innerHTML = column.render(item);
      columns[column.title] = container;
      dom.append(container);
    });
  }

  return {
    dom,
    key: item[setup.rowKey],
    row: item,
    visible: true,
    columns,
    selected() {
      return checkbox.input.checked;
    },
    select(state) {
      if (checkbox.input.checked !== state) {
        checkbox.input.checked = state;
        collection.updateSelectedCount(state ? 1 : -1);
      }
    },
    remove() {
      if (checkbox.input.checked) {
        collection.updateSelectedCount(-1);
      }
      dom.remove();
    }
  };
};

const createDOM = (collection) => {
  if (collection.type === TABLE) {
    const tableDOM = document.createElement('table');
    const theadDOM = document.createElement('thead');
    const tbodyDOM = document.createElement('tbody');
    tableDOM.append(theadDOM, tbodyDOM);

    collection.dom = tableDOM;
    collection.head = theadDOM;
    collection.body = tbodyDOM;

    const emptyDOM = document.createElement('td');
    emptyDOM.colSpan = 7;
    emptyDOM.style.textAlign = 'center';
    emptyDOM.style.padding = '10px';
    emptyDOM.innerHTML = 'No schematics found. You can sign up and upload your own schematics.';
    collection.emptyElement = emptyDOM;
  } else if (collection.type === GRID) {
    const gridBody = document.createElement('div');
    gridBody.className = 'flex flex-wrap';
    collection.dom = gridBody;
    collection.body = gridBody;

    const emptyDOM = document.createElement('div');
    emptyDOM.innerHTML = 'No heightmaps found. You can sign up and upload your own heightmaps.';
    collection.emptyElement = emptyDOM;
  }
};

const createCheckBox = (tag) => {
  const dom = document.createElement(tag);
  dom.className = 'collection-checkbox';

  const label = document.createElement('label');
  const input = document.createElement('input');
  input.type = 'checkbox';

  label.append(input);
  dom.append(label);

  return {
    dom,
    input,
  }
};

const registerMassActions = (collection, setup) => {
  if (setup.massActions === undefined) {
    collection.updateSelectedCount = (update) => {
      collection.selectedCount += update;
    };
    return;
  }
  let actionsVisible = false;

  const dom = document.createElement('div');
  dom.className = 'collection-mass-actions';
  dom.style.display = 'none';

  setup.massActions.actions.forEach(action => {
    const actionDOM = document.createElement('i');
    actionDOM.className = action.icon;
    actionDOM.title = action.title;

    actionDOM.addEventListener('click', () => {
      const selectedRows = collection.data.filter(row => row.selected()).map(row => row.row);
      action.click(selectedRows);
    });

    dom.append(actionDOM);
  });

  const container = document.querySelector(setup.massActions.selector);
  container.append(dom);

  collection.updateSelectedCount = (update) => {
    collection.selectedCount += update;

    if (collection.selectedCount <= 0 && actionsVisible) {
      collection.selectedCount = 0;
      dom.style.display = 'none';
      actionsVisible = false;
    } else if (update > 0 && !actionsVisible) {
      dom.style.display = 'block';
      actionsVisible = true;
    }

    if (collection.selectedCount === collection.rowCount) {
      collection.selectAllInput.checked = true;
    } else if (update < 0 && collection.selectedCount < collection.rowCount && collection.selectAllInput.checked) {
      collection.selectAllInput.checked = false;
    }
  };
};

const createTableHead = (collection, columns) => {
  const head = document.createElement('tr');

  const selectAllElement = createCheckBox('th');
  collection.selectAllInput = selectAllElement.input;
  head.append(selectAllElement.dom);

  columns.forEach((column) => {
    const th = document.createElement('th');
    th.innerText = column.title;
    head.append(th);
  });

  collection.head.append(head);
};

export const newCollection = (selector, type, setup) => {
  const collection = {
    type,
    data: [],
    selectedCount: 0,
    rowCount: 0,
  };
  registerMassActions(collection, setup);
  createDOM(collection);

  if (type === TABLE) {
    createTableHead(collection, setup.columns);

    collection.selectAllInput.addEventListener('change', () => {
      collection.data.forEach((row) => row.select(collection.selectAllInput.checked));
    });
  }

  if (setup.clickHandler !== undefined) {
    collection.dom.addEventListener('click', setup.clickHandler);
  }

  const areSomeVisible = () => {
    if(collection.data.length === 0) {
      return false;
    }

    return collection.data.some((row) => row.visible);
  }

  const render = () => {
    const box = document.querySelector(selector);
    collection.body.innerHTML = '';
    box.append(collection.dom);
    
    if(areSomeVisible()) {
      collection.data.forEach((row) => {
        if (row.visible) {
          collection.body.append(row.dom);
        }
      });
    } else {
      collection.body.append(collection.emptyElement);
    }
  };

  const setData = (data) => {
    collection.data = [];
    collection.rowCount = data.length;
    data.forEach((item) => {
      collection.data.push(createItem(collection, setup, item));
    });
    render();
  };

  const deleteItem = (key) => {
    collection.data.forEach((item) => {
      if (item.key === key) {
        collection.rowCount -= 1;
        item.remove();
      }
    });
  };

  const addItem = (row) => {
    collection.rowCount += 1;
    const newItem = createItem(collection, setup, row);
    collection.data.push(newItem);
    collection.body.append(newItem.dom);
  };

  const updateItem = (item) => {
    collection.data.forEach((ele) => {
      if (item[setup.rowKey] === ele.key) {
        item = {...ele.row, ...item};
        setup.columns.forEach((column) => {
          if (column.key !== undefined) {
            ele.columns[column.title].innerHTML = item[column.key];
          } else if (column.func !== undefined) {
            ele.columns[column.title].innerHTML = column.func(item);
          } else if (column.render !== undefined) {
            ele.columns[column.title].innerHTML = column.render(item);
          }
        });
      }
    });
  };

  const applyFilter = (filterStr) => {
    const multiWhitespacesRgx = new RegExp(/\s+/g);
    filterStr = filterStr || "";
    const cleanFilterStr = filterStr.trim().replace(multiWhitespacesRgx).toLowerCase();

    collection.data.forEach((element) => {
      const row = element.row;
      const cleanName = row.name.trim().replace(multiWhitespacesRgx).toLowerCase();

      element.visible = cleanName.includes(cleanFilterStr);
    });

    render();
  }

  return {
    applyFilter,
    setData,
    updateItem,
    deleteItem,
    addItem,
    render,
    dom: collection.dom,
  };
};
