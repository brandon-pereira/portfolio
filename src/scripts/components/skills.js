import Base from './base';

export default class Skills extends Base {

    events() {
        this.el.querySelectorAll('[data-accordion-handler]').forEach(handle =>
            handle.addEventListener('click', () => this.toggleItem(handle))
        );
        
        this.el.addEventListener('goToSkill', (e) => this.deeplink(e.detail));

        super.events();
    }

    toggleItem(element) {
        // Get real element
        const el = element.closest('.accordion');

        // Toggle current element
        el.classList.toggle("open");

        // Close other accordions
        Array.from(el.parentNode.childNodes).forEach(sibling => {
            if (sibling !== el) {
                sibling.classList.remove("open");
            }
        });
    }

    deeplink(id) {
        const skill = this.el.querySelector('[data-id=' + id + ']');
        const category = skill.closest('.accordion.category');
        if (skill) {
            if (!category.classList.contains('open')) this.toggleItem(category);
            if (!skill.classList.contains('open')) this.toggleItem(skill);
            this.scroll.then((s) => s.scrollTo(this.el));
        }
    }

}