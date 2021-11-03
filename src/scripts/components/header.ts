import Base from './base';
import ScrollText from 'scroll-text';

class Header extends Base {
  $title: HTMLElement;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scrollText: any;

  async init(): Promise<void> {
    this.$title = this.el.querySelector('h1.name');
    await super.init();
    this.scrollText = new ScrollText(
      this.el.querySelector('[data-scroll-text]')
    );
    document.addEventListener('scroll', () => this.onScroll());
  }

  onScroll(): void {
    const currentScroll = window.scrollY;
    this.$title.classList.toggle('scrolled', currentScroll > 100);
  }
}

export default Header;
