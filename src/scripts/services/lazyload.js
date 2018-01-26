/**
 * Class to lazy load assets. Based roughly off https://github.com/deanhume/lazy-observer-load.
 */
class LazyLoad {

    constructor() {
        const elements = document.querySelectorAll('img[data-src]');
        const config = {
            rootMargin: '50px 0px'
        };
        this.imageCount = elements.length;

        if (('IntersectionObserver' in window)) {
            console.info("LazyLoader: Supported browser... initializing.");
            this.observer = new IntersectionObserver(this.onIntersection.bind(this), config);
        } else {
            console.info("LazyLoader: Unsupported browser... loading all assets.")
        }

        this.loadImages(elements);
    }

    loadImages(elements) {
        if(this.observer) {
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
        console.log("PELOAD", image);
        const src = image.dataset.src;
        console.log(src);
        if (!src) {
            console.warn("LazyLoader: No src on img element!", image);
            return;
        }

        return this.fetchImage(src).then(() => this.applyImage(image, src));
    }

    /**
     * Load all of the images immediately
     * @param {NodeListOf<Element>} images
     */
    loadImagesImmediately(images) {
        Array.from(images).forEach((image) => {
            this.preloadImage(image);
        })
    }

    /**
     * Disconnect the observer
     */
    disconnect() {
        if (!this.observer) {
            return;
        }
        this.observer.disconnect();
        // this.observer = null;
    }

    /**
     * On intersection
     * @param {array} entries
     */
    onIntersection(entries) {
        console.log("HI", entries);
        // Disconnect if we've already loaded all of the images
        if (this.imageCount === 0) {
            console.log("DISCONNECT");
            this.observer.disconnect();
        }

        // Loop through the entries
       entries.forEach(entry => {
           // Are we in viewport?
           if (entry.intersectionRatio > 0) {
               console.log("LAZYLOAD", entry.target);
               this.imageCount -= 1;

               // Stop watching and load the image
               this.observer.unobserve(entry.target);
               this.preloadImage(entry.target);
           }
       })
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
        img.classList.add('fade-in');
    }
}

export default new LazyLoad();