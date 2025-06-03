type LightboxConfig =
  | {
      description?: string;
      src: string;
      thumbnail: string;
      height?: number;
      width?: number;
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
      video: srcElement.tagName === 'VIDEO',
      width: json.width,
      height: json.height,
      thumbnail: srcElement.src
    };
    return config;
  }

  private async renderFromConfig(_config: LightboxConfig) {
    this.$asset.innerHTML = '';
    const isVideo = _config.video;
    let $target: HTMLVideoElement | HTMLImageElement;

    if (isVideo) {
      $target = document.createElement('video');
      $target.src = _config.src;
      $target.autoplay = true;
      $target.muted = true;
      $target.loop = true;
    } else {
      $target = document.createElement('img');
      $target.src = _config.thumbnail;
      if (_config.width || _config.height) {
        $target.width = _config.width!;
        $target.height = _config.height!;
      }
    }
    this.$description.innerHTML = _config.description || '';
    this.$asset.appendChild($target);
    // If image, lazy load the high res version
    if (!isVideo) {
      preloadImage(_config.src).then(() => {
        $target.src = _config.src;
      });
    }

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
    ghost.addEventListener(
      'transitionend',
      () => {
        document.body.removeChild(ghost);
        resolve();
      },
      { once: true }
    );
  });
}

function preloadImage(src: string) {
  return new Promise<void>(resolve => {
    const img = new Image();
    img.onload = () => resolve();
    img.src = src;
  });
}

export default Lightbox;
