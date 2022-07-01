import ga from './analytics';

type LightboxConfig = {
  title: string;
  description?: string;
  url: string;
  contentType: 'image/png' | 'image/jpeg' | 'video/mp4';
};

class Lightbox {
  el: HTMLElement;
  $asset: HTMLElement;
  $description: HTMLElement;
  static dataAttribute = 'data-lightbox';
  static dataInitAttribute = 'data-lightbox-initialized';

  constructor() {
    this.el = this._createElement();
    this._attachToDocument(this.el);
    this.$asset = this.el.querySelector('[data-asset]');
    this.$description = this.el.querySelector('[data-description]');
    this.listen();
    this.el.addEventListener('click', () => this.close());
  }

  open(srcElement: HTMLImageElement) {
    this.el.classList.add('visible');
    const config = this.getConfigFromElement(srcElement);
    this.setLightboxFromConfig(config);
    if (this.$asset.querySelector('img, video')) {
      ga('lightbox', 'open', config.url);
    }
  }

  getConfigFromElement(srcElement: HTMLElement): LightboxConfig {
    const raw = srcElement.getAttribute('data-lightbox');
    const json = JSON.parse(raw);
    const config: LightboxConfig = {
      title: json.title || '',
      description: json.description || '',
      url: json.url || '',
      contentType: json.contentType || 'image/png'
    };
    return config;
  }

  setLightboxFromConfig({
    contentType,
    url,
    description,
    title
  }: LightboxConfig) {
    this._setLoading(true);
    this.$asset.innerHTML = '';
    const type = contentType.startsWith('video') ? 'video' : 'img';
    const config = {
      src: url,
      autoplay: true,
      muted: true
    } as const;
    const $asset = document.createElement(type);
    Object.keys(config).forEach((key: keyof typeof config) =>
      $asset.setAttribute(key, `${config[key]}`)
    );
    const ready = () => {
      this.$asset.appendChild($asset);
      this._setLoading(false);
    };
    if (type === 'img') {
      $asset.onload = ready;
    } else {
      ready();
    }
    this.$description.innerHTML = title || description || '';
  }

  close() {
    this.$asset.innerHTML = '';
    this.$description.innerHTML = '';
    this.el.classList.remove('visible');
  }

  listen() {
    const elements = document.querySelectorAll<HTMLImageElement>(
      `img[${Lightbox.dataAttribute}]:not([${Lightbox.dataInitAttribute}])`
    );
    elements.forEach(el => {
      el.setAttribute(Lightbox.dataInitAttribute, 'true');
      el.addEventListener('click', () => this.open(el));
    });
  }

  _setLoading(bool: boolean) {
    this.el.querySelector('.loading').classList.toggle('loaded', !bool);
  }

  _createElement() {
    const $el = document.createElement('div');
    $el.classList.add('lightbox');
    $el.setAttribute('data-close', 'true');
    $el.innerHTML = `
            <button data-close class="close-button">&times;</button>
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

  _attachToDocument(el: HTMLElement) {
    document.body.appendChild(el);
  }
}

export default new Lightbox();
