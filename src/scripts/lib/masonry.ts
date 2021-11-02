type Size = [number, number];

interface ConstructorProps {
  container: HTMLElement;
  elements: HTMLElement[];
  sizes: Size[];
}

class Masonry {
  element: HTMLElement;
  items: HTMLElement[] | [];
  sizes: Size[];

  constructor({ container, elements, sizes }: ConstructorProps) {
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

  recreateColumns(): void {
    const numColumns = this._numColumns;
    // Clear DOM
    this.element.innerHTML = '';
    // Create fragments for columns
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

  appendElements(elements: HTMLElement[]): void {
    this.items = this.items = [...this.items, ...Array.from(elements)];
    this.recreateColumns();
  }

  clearElements(): void {
    this.items = [];
    this.recreateColumns();
  }

  setElements(elements: HTMLElement[]): void {
    this.items = elements;
    this.recreateColumns();
  }

  get _numColumns(): number {
    return this.sizes.find(
      ([minWidth]) => window.matchMedia(`(min-width: ${minWidth}px)`).matches
    )[1];
  }
}

export default Masonry;
