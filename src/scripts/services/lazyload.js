/**
 * Class to lazy load assets. Based roughly off https://github.com/deanhume/lazy-observer-load.
 */
class LazyLoad {
  constructor() {
    const elements = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(this.onIntersection.bind(this), {
        rootMargin: '50px 0px'
      });
    }

    this.loadImages(elements);
  }

  loadImages(elements) {
    if (this.observer) {
      Array.from(elements).forEach(image => {
        if (!image.classList.contains('loaded')) {
          this.observer.observe(image);
        }
      });
    } else {
      this.loadImagesImmediately(elements);
    }
  }

  /**
   * Fetchs the image for the given URL
   * @param {string} url
   */
  fetchImage(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = url;
      image.onload = resolve;
      image.onerror = reject;
    });
  }

  /**
   * Preloads the image
   * @param {object} image
   */
  preloadImage(image) {
    const src = image.dataset.src;
    if (!src) {
      if (!PRODUCTION) {
        console.warn('LazyLoader: No src on img element!', image);
      }
      return;
    }

    return this.fetchImage(src)
      .then(() => this.applyImage(image, src))
      .catch(() => console.error(`Failed to lazy load ${src}`));
  }

  /**
   * Load all of the images immediately
   * @param {NodeListOf<Element>} images
   */
  loadImagesImmediately(images) {
    Array.from(images).forEach(image => {
      this.preloadImage(image);
    });
  }

  /**
   * On intersection
   * @param {array} entries
   */
  onIntersection(entries) {
    // Loop through the entries
    entries.forEach(entry => {
      // Are we in viewport?
      if (entry.intersectionRatio > 0) {
        // Stop watching and load the image
        this.observer.unobserve(entry.target);
        this.preloadImage(entry.target);
      }
    });
  }

  /**
   * Apply the image
   * @param {object} img
   * @param {string} src
   */
  applyImage(img, src) {
    // Prevent this from being lazy loaded a second time.
    img.classList.add('loaded');
    img.src = src;
  }
}

export default new LazyLoad();
