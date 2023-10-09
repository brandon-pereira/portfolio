type LightboxConfig = {
  title: string;
  description?: string;
  url: string;
  contentType: 'image/png' | 'image/jpeg' | 'video/mp4';
};

class Lightbox {
  $el: HTMLElement;
  $asset: HTMLElement;
  $description: HTMLElement;

  static dataAttribute = 'data-lightbox';
  static dataInitAttribute = 'data-lightbox-initialized';

  constructor() {
    this.$el = document.createElement('div');
    this.$el.classList.add('lightbox');
    this.$el.setAttribute('data-close', 'true');
    this.$el.innerHTML = `
        <button data-close class="close-button">&times;</button>
        <div class="modal-content">
            <div data-asset></div>
            <div data-description></div>
        </div>
      `;
    document.body.appendChild(this.$el);
    this.$asset = this.$el.querySelector('[data-asset]')!;
    this.$description = this.$el.querySelector('[data-description]')!;
    this.findAndAttachListeners();
    this.events();
  }

  async open(srcElement: HTMLImageElement) {
    // start opening
    this.$el.classList.add('opening');
    // get configuration for lightbox
    const config = this.getConfigFromElement(srcElement);
    if (!config) {
      console.warn('Missing Configuration Object');
      return;
    }
    // update lightbox ui with new data
    await this.renderFromConfig(config);
    // animate from src to target
    await animateElementOpen(srcElement);
    // animation is done, update UI
    this.$el.classList.add('open');
  }

  close() {
    this.$asset.innerHTML = '';
    this.$description.innerHTML = '';
    this.$el.classList.remove('opening', 'open');
  }

  findAndAttachListeners() {
    if (!this.$el) {
      this.createLightBoxElements();
    }

    const elements = document.querySelectorAll<HTMLImageElement>(
      `img[${Lightbox.dataAttribute}]:not([${Lightbox.dataInitAttribute}])`
    );
    elements.forEach(el => {
      el.setAttribute(Lightbox.dataInitAttribute, 'true');
      el.addEventListener('click', () => this.open(el));
    });
  }

  private createLightBoxElements() {
    this.$el = document.createElement('div');
    this.$el.classList.add('lightbox');
    this.$el.setAttribute('data-close', 'true');
    this.$el.innerHTML = `
        <button data-close class="close-button">&times;</button>
        <div class="modal-content">
            <div data-asset></div>
            <div data-description></div>
        </div>
      `;
    document.body.appendChild(this.$el);
  }

  private async events() {
    this.$el.addEventListener('click', this.close.bind(this));
    document.addEventListener('keydown', e => {
      if (this.$el.classList.contains('open') && e.key === 'Escape') {
        this.close();
      }
    });
  }

  private getConfigFromElement(srcElement: HTMLElement): LightboxConfig | null {
    const raw = srcElement.getAttribute('data-lightbox');
    if (!raw) return null;
    const json = JSON.parse(raw);
    const config: LightboxConfig = {
      title: json.title || '',
      description: json.description || '',
      url: json.url || '',
      contentType: json.contentType || 'image/png'
    };
    return config;
  }

  private renderFromConfig({
    contentType,
    url,
    description,
    title
  }: LightboxConfig) {
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
    this.$description.innerHTML = title || description || '';
    const listenForLoad = new Promise<void>(resolve => {
      if (type === 'img') {
        $asset.onload = () => resolve();
      } else {
        resolve();
      }
    });
    this.$asset.appendChild($asset);
    return Promise.race([listenForLoad, sleep(400)]);
  }
}

function animateElementOpen($el: HTMLImageElement) {
  return new Promise<void>(resolve => {
    // Create a ghost elements
    const ghost = document.createElement('img');
    ghost.src = $el.src;
    ghost.classList.add('ghost--img');
    // Get real element coordinates
    const rect = $el.getBoundingClientRect();
    // Add styling to ghost element
    Object.assign(ghost.style, {
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      height: `${rect.height}px`,
      width: `${rect.width}px`
    });
    // Add ghost to DOM
    document.body.appendChild(ghost);
    // get target element
    const target = document.querySelector('.lightbox img') as HTMLImageElement;
    requestAnimationFrame(() => {
      const endRect = target.getBoundingClientRect();
      Object.assign(ghost.style, {
        top: `${endRect.top}px`,
        left: `${endRect.left}px`,
        height: `${endRect.height}px`,
        width: `${endRect.width}px`
      });
    });
    sleep(350).finally(() => {
      document.body.removeChild(ghost);
      resolve();
    });
  });
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default Lightbox;
