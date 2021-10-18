import ga from '../services/analytics';

export default class Base {
  el: HTMLElement;
  lightbox: any;
  logEvent: any;

  constructor(el: HTMLElement) {
    if (process.env.NODE_ENV !== 'production' && !el) {
      console.warn(`Can't find container for "${this.constructor.name}".`);
      return null;
    }
    this.el = el;
    this.lightbox = import('../services/lightbox').then(m => m.default);
    this.logEvent = ga;
    this.init()
      .then(() => this.setLoading(false))
      .catch(err => console.error(err));
  }

  setLoading(isLoading: boolean): void {
    if (this.el.querySelector('.init') && this.el.querySelector('.loading')) {
      this.el.querySelector('.init').classList.toggle('true', !isLoading);
      this.el.querySelector('.loading').classList.toggle('loaded', !isLoading);
    }
  }

  init(dependencies = Promise.resolve()): Promise<void> {
    return Promise.resolve(dependencies).then(() => this.events());
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  events(): void {}
}
