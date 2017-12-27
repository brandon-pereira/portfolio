import Base from './base';

export default class Apps extends Base {

    init() {
        this.currentIndex = 0;
        this.slides = Array.from(this.el.querySelectorAll('.carousel-slides .carousel-slide'));
        this.currentSlide = this.slides[0];
        this.dots = Array.from(this.el.querySelectorAll('.carousel-dots .dot'));
        return super.init();
    }

    events() {
        this.el.querySelectorAll('[data-goto]').forEach(el =>
            el.addEventListener('click', () => {
                console.log(el);
                const goto = el.getAttribute('data-goto');
                this.goto(goto);
            })
        );

        return super.events();
    }

    goto(slide) {
        switch(slide) {
            case "next":
                this.setCurrentSlide(this.currentIndex + 1 < this.slides.length ? this.currentIndex + 1 : 0);
                break;
            case "prev":
                this.setCurrentSlide(this.currentIndex - 1 !== -1 ? this.currentIndex - 1 : this.slides.length - 1);
                break;
            default:
                if(!isNaN(slide)) {
                    this.setCurrentSlide(Number(slide));
                } else {
                    throw new Error("Invalid slide, expected index and got:", slide);
                }
        }
    }

    setCurrentSlide(slide) {
        // Get Elements
        const newSlide = this.slides[slide];
        const currentSlide = this.currentSlide;
        // Toggle classes on carousel slides
        currentSlide.classList.remove('currentSlide');
        newSlide.classList.add('currentSlide');
        // Change the main carousel styling
        this.el.classList.remove(currentSlide.getAttribute('data-styling'));
        this.el.classList.add(newSlide.getAttribute('data-styling'));
        // Update Dot
        this.dots.forEach((el, i) => {
            if(i !== slide) {
                el.classList.remove('active');
            } else {
                el.classList.add('active');
            }
        })
        // Update References
        this.currentSlide = newSlide;
        this.currentIndex = slide;
    }

}