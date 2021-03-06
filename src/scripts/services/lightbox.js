import ga from './analytics';

class Lightbox {
  constructor() {
    this.el = this._createElement();
    this._attachToDocument(this.el);
    this.$asset = this.el.querySelector('[data-asset]');
    this.$description = this.el.querySelector('[data-description]');
    this.events();
    import(/* webpackChunkName: "styles" */ '../../styles/lightbox.scss');
    if (!PRODUCTION) {
      console.info('Lightbox: Initialized');
    }
  }

  set(props) {
    if (!PRODUCTION) {
      console.info('Lightbox: Set', props);
    }
    this._setLoading(true);
    this.$asset.innerHTML = '';
    const type = props.contentType.startsWith('video') ? 'video' : 'img';
    const config = {
      src: props.url,
      autoplay: true,
      muted: true
    };
    const $asset = document.createElement(type);
    Object.keys(config).forEach(key => $asset.setAttribute(key, config[key]));
    const ready = () => {
      this.$asset.appendChild($asset);
      this._setLoading(false);
    };
    if (type === 'img') {
      $asset.onload = ready;
    } else {
      ready();
    }
    this.$description.innerHTML = props.title || props.description || '';
  }

  open() {
    if (!PRODUCTION) {
      console.info('Lightbox: Open');
    }
    this.el.classList.add('visible');
    if (this.$asset.querySelector('img, video')) {
      ga('lightbox', 'open', this.$asset.querySelector('img, video').src);
    }
  }

  close() {
    if (!PRODUCTION) {
      console.info('Lightbox: Close');
    }
    this.$asset.innerHTML = '';
    this.$description.innerHTML = '';
    this.el.classList.remove('visible');
  }

  events() {
    this.el.addEventListener('click', () => this.close());
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
