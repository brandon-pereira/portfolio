module.exports = class Masonry {
  constructor({ container, elements, sizes }) {
    this.element = container;
    this.items = elements || [];
    this.sizes = sizes || [[0, 1]];
    if (!this.items || !this.element || !this.sizes || !this.sizes.length) {
      throw new Error(
        'Missing container, elements, or sizes on Masonry initialization.'
      );
    }
    this.sizes = this.sizes.sort((a, b) => (a[0] > b[0] ? -1 : 1)); // eslint-disable-line no-confusing-arrow
    this.recreateColumns();
  }

  recreateColumns() {
    const numColumns = this._numColumns;
    // Clear DOM
    this.element.innerHTML = '';
    // Create fragements for columns
    const columns = Array.from(Array(numColumns)).map(() =>
      document.createDocumentFragment()
    );
    // Add items to appropriate columns
    this.items.forEach((item, i) => {
      columns[i % numColumns].appendChild(item);
    });
    // Append columns to a virtual dom
    const grid = document.createDocumentFragment();
    columns.forEach(items => {
      const column = document.createElement('div');
      column.classList.add('column');
      column.appendChild(items);
      grid.appendChild(column);
    });
    // Append to real dom
    this.element.appendChild(grid);
  }

  appendElements(elements) {
    this.items = this.items.concat(...elements);
    this.recreateColumns();
  }

  clearElements() {
    this.items = [];
    this.recreateColumns();
  }

  setElements(elements) {
    this.items = elements;
    this.recreateColumns();
  }

  get _numColumns() {
    return this.sizes.find(
      ([minWidth]) => window.matchMedia(`(min-width: ${minWidth}px)`).matches
    )[1];
  }
};
