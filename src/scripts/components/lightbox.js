class Lightbox {

    constructor() {
        this.el = this._createElement();
        this._attachToDocument(this.el);

        console.info("Lightbox: Initialized");
    }

    set(props) {
        console.info("Lightbox: Set", props);
    }

    open() {
        console.info("Lightbox: Open");
        this.el.classList.add('open');
    }

    close() {
        console.info("Lightbox: Close");
        this.el.classList.remove('open');
    }

    _createElement() {
        const $el = document.createElement('div');
        $el.classList.add('overlay');
        $el.innerText = ``;
        return $el;
    }

    _attachToDocument(el) {
        document.body.appendChild(el);
    }
}

export default new Lightbox();