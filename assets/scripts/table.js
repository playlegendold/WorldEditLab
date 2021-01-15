const createDOM = (table) => {
  const tableDOM = document.createElement('table');
  const theadDOM = document.createElement('thead');
  const tbodyDOM = document.createElement('tbody');

  tableDOM.append(theadDOM, tbodyDOM);
  table.dom = tableDOM;
  table.thead = theadDOM;
  table.tbody = tbodyDOM;
};

const createTHead = (table, columns) => {
  const head = document.createElement('tr');

  const selectAllElement = createCheckBox('th');
  table.selectAllInput = selectAllElement.input;
  head.append(selectAllElement.dom);

  columns.forEach((column) => {
    const th = document.createElement('th');
    th.innerText = column.title;
    head.append(th);
  });

  table.thead.append(head);
};

const createRow = (table, setup, row) => {
  const tr = document.createElement('tr');
  const checkbox = createCheckBox('td');
  tr.append(checkbox.dom);
  const columns = [];

  setup.columns.forEach((column) => {
    const td = document.createElement('td');
    const span = document.createElement('span');
    if (column.key !== undefined) {
      span.innerHTML = row[column.key];
    } else if (column.func !== undefined) {
      span.innerHTML = column.func(row);
    }
    columns[column.title] = span;
    td.append(span);
    tr.append(td);
  });

  checkbox.input.addEventListener('change', () => {
    table.updateSelectedCount(checkbox.input.checked ? 1 : -1);
  });

  return {
    dom: tr,
    key: row[setup.rowKey],
    row: row,
    visible: true,
    columns,
    selected() {
      return checkbox.input.checked;
    },
    select(state) {
      if (checkbox.input.checked !== state) {
        checkbox.input.checked = state;
        table.updateSelectedCount(state ? 1 : -1);
      }
    },
    remove() {
      tr.remove();
    }
  };
};

const createCheckBox = (tag) => {
  const dom = document.createElement(tag);
  dom.className = 'table-checkbox';

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

const registerMassActions = (table, setup) => {
  if (setup.massActions === undefined) {
    return;
  }
  let actionsVisible = false;

  const dom = document.createElement('div');
  dom.className = 'table-mass-actions';
  dom.style.display = 'none';

  setup.massActions.actions.forEach(action => {
    const actionDOM = document.createElement('i');
    actionDOM.className = action.icon;
    actionDOM.title = action.title;

    actionDOM.addEventListener('click', () => {
      const selectedRows = table.data.filter(row => row.selected()).map(row => row.row);
      action.click(selectedRows);
    });

    dom.append(actionDOM);
  });

  const container = document.querySelector(setup.massActions.selector);
  container.append(dom);

  table.updateSelectedCount = (update) => {
    table.selectedCount += update;

    if (table.selectedCount <= 0 && actionsVisible) {
      table.selectedCount = 0;
      dom.style.display = 'none';
      actionsVisible = false;
    } else if (update > 0 && !actionsVisible) {
      dom.style.display = 'block';
      actionsVisible = true;
    }

    if (table.selectedCount === table.rowCount) {
      table.selectAllInput.checked = true;
    } else if (update < 0 && table.selectedCount < table.rowCount && table.selectAllInput.checked) {
      table.selectAllInput.checked = false;
    }
  };
};

export const newTable = (selector, setup) => {
  const table = {
    data: [],
    selectedCount: 0,
    rowCount: 0,
  };
  registerMassActions(table, setup);
  createDOM(table);
  createTHead(table, setup.columns);

  table.selectAllInput.addEventListener('change', () => {
    table.data.forEach((row) => row.select(table.selectAllInput.checked));
  });

  if (setup.clickHandler !== undefined) {
    table.dom.addEventListener('click', setup.clickHandler);
  }

  const render = () => {
    const box = document.querySelector(selector);
    table.tbody.innerHTML = '';
    box.append(table.dom);

    table.data.forEach((row) => {
      if (row.visible) {
        table.tbody.append(row.dom);
      }
    });
  };

  const setData = (data) => {
    table.data = [];
    table.rowCount = data.length;
    data.forEach((row) => {
      table.data.push(createRow(table, setup, row));
    });
    render();
  };

  const deleteRow = (key) => {
    table.data.forEach((row) => {
      if (row.key === key) {
        table.rowCount -= 1;
        row.remove();
      }
    });
  };

  const addRow = (row) => {
    table.rowCount += 1;
    const newRow = createRow(table, setup, row);
    table.data.push(newRow);
    table.tbody.append(newRow.dom);
  };

  const updateRow = (row) => {
    table.data.forEach((tableRow) => {
      if (row[setup.rowKey] === tableRow.key) {
        row = {...tableRow.row, ...row};
        setup.columns.forEach((column) => {
          if (column.key !== undefined) {
            tableRow.columns[column.title].innerHTML = row[column.key];
          } else if (column.func !== undefined) {
            tableRow.columns[column.title].innerHTML = column.func(row);
          }
        });
      }
    });
  };

  return {
    setData,
    updateRow,
    deleteRow,
    addRow,
    render,
  };
};
