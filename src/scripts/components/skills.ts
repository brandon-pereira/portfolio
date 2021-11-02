import Base from './base';
import animate from '../lib/animate';
import { DeeplinkPayload } from './projects';

export type SkillEvent = CustomEvent<string>;

export default class Skills extends Base {
  init(): Promise<void> {
    return super.init();
  }

  events(): void {
    Array.from(this.el.querySelectorAll('[data-accordion-handler]')).forEach(
      (handle: HTMLElement) =>
        handle.addEventListener('click', () => this.toggleItem(handle))
    );

    Array.from(this.el.querySelectorAll('[data-go-to-project]')).forEach(
      handle =>
        handle.addEventListener('click', () => {
          const id = handle.getAttribute('data-go-to-project');
          const title = handle
            .closest('.accordion')
            .querySelector('.title').textContent;
          this.goToSkill({
            id,
            title
          });
        })
    );

    this.el.addEventListener('goToSkill', (e: SkillEvent) =>
      this.deeplink(e.detail)
    );

    super.events();
  }

  goToSkill(detail: DeeplinkPayload): void {
    document
      .querySelector('#projects')
      .dispatchEvent(new CustomEvent('goToLang', { detail }));
  }

  toggleItem(element: HTMLElement): void {
    // Get real element
    const el = element.closest('.accordion') as HTMLElement;

    // Toggle current element
    el.classList.toggle('open');
    const isOpen = el.classList.contains('open');
    this.toggleTabIndex(el, isOpen);

    // Animate open if supported
    if (isOpen) {
      const toHeight = el.clientHeight + 'px';
      animate(el, [{ height: 0 }, { height: toHeight }], { duration: 200 });
    }

    // Close other accordions
    Array.from(el.parentNode.childNodes).forEach((sibling: HTMLElement) => {
      console.log(sibling);
      if (sibling !== el && sibling.classList.contains('open')) {
        this.toggleTabIndex(sibling, false);
        sibling.classList.remove('open');
      }
    });

    // Analytics
    this.logEvent('skills', 'open', el.querySelector('.title').textContent);
  }

  // Toggles element tab index for accessibility
  toggleTabIndex($el: HTMLElement, bool: boolean): void {
    const index = bool ? 0 : -1;
    const isCategory = $el.classList.contains('category');
    let els = $el.querySelectorAll(
      '[data-closable]'
    ) as NodeListOf<HTMLElement>;
    if (isCategory && bool) {
      // Only add tab index to skills
      els = $el.querySelectorAll('article > section > [data-closable]');
    } else if (isCategory) {
      // Remove tab index from skills and buttons
      els = $el.querySelectorAll('article > section [data-closable]');
    } else {
      // Only toggle the copy tab index
      els = $el.querySelectorAll('article > section > article [data-closable]');
    }
    Array.from(els).forEach(el => {
      el.tabIndex = index;
    });
  }

  deeplink(id: string): void {
    const skill = this.el.querySelector(
      '[data-id="' + id + '"]'
    ) as HTMLElement;
    if (skill) {
      const category = skill.closest('.accordion.category') as HTMLElement;
      if (!category.classList.contains('open')) this.toggleItem(category);
      if (!skill.classList.contains('open')) this.toggleItem(skill);
      console.log(this.el);
      this.el.scrollIntoView();
    } else {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('No skills section found for', id);
      }
    }
  }
}
