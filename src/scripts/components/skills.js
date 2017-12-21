import Base from './base';

export default class Skills extends Base {

    events() {
        Array.from(this.el.querySelectorAll('[data-accordion-handler]')).forEach(handle =>
            handle.addEventListener('click', this.toggleItem.bind(this))
        );

        super.events();
    }

    toggleItem(e) {
        // Get real element
        const el = e.target.closest('.accordion');

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