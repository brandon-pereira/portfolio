import debounce from '../lib/debounce';
import ga from './analytics';

class Scroll {
  constructor() {
    this.sections = Array.from(document.querySelectorAll('.container'));
    this.analytics = Array.from(
      document.querySelectorAll('[data-track-section]')
    ).map(el => el.getAttribute('id'));

    this._trackSmoothScrollLinks();
    this._trackSectionScrolling();
  }

  /**
   * Function to check if element is in view.
   * Based loosely off https://github.com/camwiegert/in-view/blob/master/src/viewport.js
   * @param {Element} element element to check against
   * @param {Number} threshold amount of extra space above and below
   */
  isInView(element, threshold = 0.5) {
    const { top, bottom, height } = element.getBoundingClientRect();
    const intersection = {
      t: bottom,
      b: window.innerHeight - top
    };
    const _threshold = threshold * height;
    return intersection.t > _threshold && intersection.b > _threshold;
  }

  /**
   * Function to scroll to an element in the DOM.
   * @param {Element} element
   * @param {Number} speed time to scroll to in ms
   */
  scrollTo(element, speed = 200, hash) {
    this._scroll(
      element.getBoundingClientRect().top + window.scrollY,
      speed,
      hash
    );
  }

  /**
   * Function to track section scrolls. Being debounced by half a second
   * Based loosely off https://github.com/camwiegert/in-view/blob/master/src/viewport.js
   */
  _trackSectionScrolling() {
    document.addEventListener(
      'scroll',
      debounce(() => {
        this.sections.forEach((section, i) => {
          if (this.isInView(section)) {
            const name = section.getAttribute('id');
            if (process.env.NODE_ENV !== 'production') {
              console.log('Scroll: New element inView:', name);
            }
            if (this.analytics.indexOf(name) !== -1) {
              ga('scroll', 'section', name);
              this.analytics.splice(i, 1);
            }
          }
        });
      }, 500),
      { passive: true }
    );
  }

  /**
   * Method which adds event listeners to all the [data-smooth-scroll] elements
   * and enables smoothly scrolling them.
   */
  _trackSmoothScrollLinks() {
    document.querySelectorAll('[data-smooth-scroll]').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        const hash = e.currentTarget.getAttribute('href');
        this.scrollTo(document.querySelector(hash), 200, hash);
      });
    });
  }

  /**
   * Method to smooth scroll page. Recursive.
   * @private
   * @param {Number} to where to scroll to (in px) from top of page
   * @param {Number} duration how long animation should take
   * @param {String} hash url location after scroll
   */
  _scroll(to, duration, hash) {
    if (duration <= 0) {
      if (hash) {
        location.hash = hash;
      }
      return;
    }
    var difference = to - window.scrollY;
    var perTick = (difference / duration) * 10;
    requestAnimationFrame(() => {
      if (!isNaN(parseInt(perTick, 10))) {
        window.scrollTo(0, window.scrollY + perTick);
        this._scroll(to, duration - 10, hash);
      }
    });
  }
}

export default new Scroll();
