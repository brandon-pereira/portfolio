import Base from './base';
import ScrollText from 'scroll-text';

class Header extends Base {
  $title: HTMLElement;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scrollText: any;

  async init(): Promise<void> {
    this.$title = this.el.querySelector('h1.name');
    this.letterize(this.$title);
    await super.init(import('../../styles/header.scss'));
    this.scrollText = new ScrollText(
      this.el.querySelector('[data-scroll-text]')
    );
    document.addEventListener('scroll', () => this.onScroll());
  }

  letterize(el: HTMLElement): void {
    const textContent = el.textContent;
    if (textContent && textContent.length) {
      const text = textContent.split('');
      const nodes = text.map(letter => {
        const span = document.createElement('span');
        span.setAttribute('data-title', letter);
        span.textContent = letter;
        return span;
      });
      el.innerText = '';
      nodes.forEach(node => el.appendChild(node));
    }
  }

  onScroll(): void {
    this.$title.classList.add('scrolled');
  }
}

export default Header;
