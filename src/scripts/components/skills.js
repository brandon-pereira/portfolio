import Base from './base';
import animate from '../lib/animate';

export default class Skills extends Base {

    init() {
        return super.init(import('../../styles/skills.scss'));
    }

    events() {
        Array.from(this.el.querySelectorAll('[data-accordion-handler]')).forEach(handle =>
            handle.addEventListener('click', () => this.toggleItem(handle))
        );
        
        Array.from(this.el.querySelectorAll('[data-go-to-project]')).forEach(handle =>
            handle.addEventListener('click', () =>
                this.goToSkill(handle.getAttribute('data-go-to-project'))))

        this.el.addEventListener('goToSkill', (e) => this.deeplink(e.detail));
        
        super.events();
    }

    goToSkill(lang) {
        document.querySelector('#projects').dispatchEvent(new CustomEvent('goToLang', {detail: lang}))
    }

    toggleItem(element) {
        // Get real element
        const el = element.closest('.accordion');

        // Toggle current element
        el.classList.toggle("open");

        // Animate open if supported
        if(el.classList.contains('open')) {
            const toHeight = el.clientHeight + 'px';
            animate(el, [{ height: 0 }, { height: toHeight }], { duration: 200 })
        }
        
        // Close other accordions
        Array.from(el.parentNode.childNodes).forEach(sibling => {
            if (sibling !== el) {
                sibling.classList.remove("open");
            }
        });

        // Analytics
        this.logEvent('skills', 'open', el.querySelector('.title').textContent);

    }

    deeplink(id) {
        const skill = this.el.querySelector('[data-id=' + id + ']');
        if (skill) {
            const category = skill.closest('.accordion.category');
            if (!category.classList.contains('open')) this.toggleItem(category);
            if (!skill.classList.contains('open')) this.toggleItem(skill);
            this.scroll.then((s) => s.scrollTo(this.el));
        } else {
            console.warn("No skills section found for", id);
        }
    }

}