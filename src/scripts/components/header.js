import Base from './base';
import ScrollText from 'scroll-text';

export default class Header extends Base {
  init() {
    this.letterize(this.el.querySelector('h1.name'));
    return super
      .init(import(/* webpackChunkName: "styles" */ '../../styles/header.scss'))
      .then(() => {
        this.ScrollText = new ScrollText(
          this.el.querySelector('[data-scroll-text]')
        );
      });
  }

  letterize(el) {
    let text = el.innerText;
    if (text && text.length) {
      text = text.split('');
      const nodes = text.map(letter => {
        const span = document.createElement('span');
        span.setAttribute('data-title', letter);
        span.innerHTML = letter;
        return span;
      });
      el.innerText = '';
      nodes.forEach(node => el.appendChild(node));
    }
    return el;
  }
}
