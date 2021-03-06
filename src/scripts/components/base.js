import ga from '../services/analytics';

export default class Base {
  constructor(el, props = {}) {
    if (!PRODUCTION && !el) {
      console.warn(`Can't find container for "${this.constructor.name}".`);
      return null;
    }
    this.el = el;
    this.props = props;
    this.lightbox = import(
      /* webpackChunkName: "lightbox" */ '../services/lightbox'
    ).then(m => m.default);
    this.logEvent = ga;
    this.init()
      .then(() => this.setLoading(false))
      .catch(err => console.error(err));
  }

  setLoading(bool) {
    if (this.el.querySelector('.init') && this.el.querySelector('.loading')) {
      this.el.querySelector('.init').classList.toggle('true', !bool);
      this.el.querySelector('.loading').classList.toggle('loaded', !bool);
    }
  }

  init(dependencies = Promise.resolve()) {
    return Promise.resolve(dependencies).then(() => this.events());
  }

  events() {}

  // onFocus() {
  //     console.log("onFocus");
  // }

  // onBlur() {
  //     console.log("onBlur");
  // }
}
