import Base from './base';
import ScrollText from 'scroll-text';

class Header extends Base {
  $title: HTMLElement;

  async init(): Promise<void> {
    this.$title = this.el.querySelector('h1.name');
    await super.init();
    new ScrollText(this.el.querySelector('[data-scroll-text]'));
    document.addEventListener('scroll', () => this.onScroll());
  }

  onScroll(): void {
    const currentScroll = window.scrollY;
    this.$title.classList.toggle('scrolled', currentScroll > 25);
  }
}

export default Header;
