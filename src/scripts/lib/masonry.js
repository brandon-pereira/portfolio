module.exports = class Masonry {

    constructor(el, items) {
        this.element = el;
        this.items = items || [];
    }

    recreateColumns() {
        console.log(this.items);
        // Clear DOM
        this.element.innerHTML = '';
        // Create fragements for columns
        const columns = Array.from(Array(this._numColumns))
            .map(() => document.createDocumentFragment());
        // Add items to appropriate columns
        this.items.forEach((item, i) => {
            columns[(i % this._numColumns)].appendChild(item);
        });
        // Append columns to a virtual dom
        const grid = document.createDocumentFragment();
        columns.forEach(items => {
            const column = document.createElement("div");
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
        return Number(window.getComputedStyle(this.element, ':before')
            .getPropertyValue('content').slice(1, -1));
    }

}