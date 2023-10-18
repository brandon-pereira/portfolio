type LightboxConfig =
  | {
      description?: string;
      src: string;
      video?: false;
    }
  | {
      description?: string;
      src: string;
      video: true;
    };

type SourceElement = HTMLImageElement | HTMLVideoElement;
type TargetElement = SourceElement;

class Lightbox {
  $el: HTMLElement;
  $asset: HTMLElement;
  $description: HTMLElement;

  static dataAttribute = 'data-lightbox';
  static dataInitAttribute = 'data-lightbox-initialized';

  constructor() {
    this.$el = document.querySelector('[data-lightbox-container]')!;
    this.$asset = this.$el.querySelector('[data-asset]')!;
    this.$description = this.$el.querySelector('[data-description]')!;
    this.findAndAttachListeners();
    this.events();
  }

  async open($source: SourceElement) {
    // start opening
    this.$el.classList.add('opening');
    // get configuration for lightbox
    const config = this.getConfigFromElement($source);
    if (!config) {
      console.warn('Missing Configuration Object');
      return;
    }
    // update lightbox ui with new data
    const $target = await this.renderFromConfig(config);
    // animate from src to target
    await animateElementOpen($source, $target);
    // animation is done, update UI
    this.$el.classList.add('open');
  }

  close() {
    this.$asset.innerHTML = '';
    this.$description.innerHTML = '';
    this.$el.classList.remove('opening', 'open');
  }

  findAndAttachListeners() {
    const elements = document.querySelectorAll<SourceElement>(
      `[${Lightbox.dataAttribute}]:not([${Lightbox.dataInitAttribute}])`
    );
    elements.forEach(el => {
      el.setAttribute(Lightbox.dataInitAttribute, 'true');
      el.addEventListener('click', () => this.open(el));
    });
  }

  private async events() {
    this.$el.addEventListener('click', this.close.bind(this));
    document.addEventListener('keydown', e => {
      if (this.$el.classList.contains('open') && e.key === 'Escape') {
        this.close();
      }
    });
  }

  private getConfigFromElement(
    srcElement: SourceElement
  ): LightboxConfig | null {
    const raw = srcElement.getAttribute('data-lightbox');
    if (!raw) return null;
    const json = JSON.parse(raw);
    const config: LightboxConfig = {
      description: json.description || '',
      src: json.src || '',
      video: srcElement.tagName === 'VIDEO'
    };
    return config;
  }

  private async renderFromConfig({ src, description, video }: LightboxConfig) {
    this.$asset.innerHTML = '';
    const type = video ? 'video' : 'img';
    const config = {
      src,
      autoplay: true,
      muted: true
    } as const;
    const $target = document.createElement(type);
    // @ts-expect-error let this slide
    Object.keys(config).forEach((key: keyof typeof config) =>
      $target.setAttribute(key, `${config[key]}`)
    );
    this.$description.innerHTML = description || '';
    const listenForLoad = new Promise<void>(resolve => {
      $target.onload = () => resolve();
      $target.onloadeddata = () => resolve();
    });
    this.$asset.appendChild($target);
    await Promise.race([listenForLoad, sleep(400)]);
    return $target;
  }
}

function animateElementOpen($source: SourceElement, $target: TargetElement) {
  return new Promise<void>(resolve => {
    // Create a ghost elements
    const ghost = document.createElement($source.tagName) as SourceElement;
    ghost.src = $source.src;
    ghost.classList.add('ghost--img');
    // Get real element coordinates
    const rect = $source.getBoundingClientRect();
    // Add styling to ghost element
    Object.assign(ghost.style, {
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      height: `${rect.height}px`,
      width: `${rect.width}px`
    });
    // Add ghost to DOM
    document.body.appendChild(ghost);
    requestAnimationFrame(() => {
      const endRect = $target.getBoundingClientRect();
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
