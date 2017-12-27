import Base from './base';

export default class Skills extends Base {

    events() {
        this.el.querySelectorAll('[data-accordion-handler]').forEach(handle =>
            handle.addEventListener('click', () => this.toggleItem(handle))
        );

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

}