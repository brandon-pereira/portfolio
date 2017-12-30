class Lightbox {

    constructor() {
        this.el = this._createElement();
        this._attachToDocument(this.el);
        this.events();

        console.info("Lightbox: Initialized");
    }

    set(props) {
        console.info("Lightbox: Set", props);
        this._setLoading(true);
        this.el.querySelector('[data-asset]').innerHTML = '';
        const type = props.type || 'img';
        console.log(type);
        const config = {
            src: props.src,
            autoplay: true,
            muted: true,
            class: props.styling
        };
        const $asset = document.createElement(type);
        Object.keys(config).forEach((key) => $asset.setAttribute(key, config[key]));
        const ready = () => {
            this.el.querySelector('[data-asset]').appendChild($asset);
            this._setLoading(false);
        }
        if(type === 'img') {
            $asset.onload = ready;
        } else {
            ready();
        }
        this.el.querySelector('[data-description]').innerHTML = props.title || '';
    }

    open() {
        console.info("Lightbox: Open");
        this.el.classList.add('visible');
    }

    close() {
        console.info("Lightbox: Close");
        this.el.querySelector('[data-asset]').innerHTML = '';
        this.el.querySelectorAll('[data-description]').innerHTML = '';
        this.el.classList.remove('visible');
    }

    events() {
        this.el.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', () => this.close()));
    }

    _setLoading(bool) {
        this.el.querySelector('.loading').classList.toggle('loaded', !bool);
    }

    _createElement() {
        const $el = document.createElement('div');
        $el.classList.add('lightbox');
        $el.setAttribute('data-close', true);
        $el.innerHTML = `
            <a data-close class="close-button">&times;</a>
            <div class="modal-content">
                <div data-asset>
            
                </div>
                <div class="loading visible">
                    <div class="plus-loader">
                        Loading…
                    </div>
                </div>
                <div data-description></div>
            </div>`;
        return $el;
    }

    _attachToDocument(el) {
        document.body.appendChild(el);
    }
}

export default new Lightbox();