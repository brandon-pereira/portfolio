import Base from './base';

export default class Apps extends Base {
  init() {
    this.currentIndex = 0;
    this.slides = Array.from(
      this.el.querySelectorAll('.carousel-slides .carousel-slide')
    );
    this.currentSlide = this.slides[0];
    this.dots = Array.from(this.el.querySelectorAll('.carousel-dots .dot'));
    return super.init(
      import(/* webpackChunkName: "styles" */ '../../styles/apps.scss')
    );
  }

  events() {
    Array.from(this.el.querySelectorAll('[data-goto]')).forEach(el =>
      el.addEventListener('click', () => {
        const goto = el.getAttribute('data-goto');
        this.goto(goto);
      })
    );

    Array.from(this.el.querySelectorAll('[data-lightbox]')).forEach(el =>
      el.addEventListener('click', () => {
        const raw = el.getAttribute('data-lightbox');
        this.lightbox.then(l => {
          l.set(JSON.parse(raw));
          l.open();
        });
      })
    );

    // Swiping (mobile)
    let start = 0;
    let end = 0;

    this.slides.forEach(el =>
      el.addEventListener(
        'touchstart',
        event => {
          start = event.changedTouches[0].screenX;
        },
        { passive: true }
      )
    );

    this.slides.forEach(el =>
      el.addEventListener(
        'touchend',
        event => {
          end = event.changedTouches[0].screenX;
          handleGesure(start, end, 50);
        },
        { passive: true }
      )
    );

    const handleGesure = (touchstart, touchend, threshold) => {
      if (touchend < touchstart && touchstart - touchend >= threshold) {
        this.goto('next');
      } else if (touchend > touchstart && touchend - touchstart >= threshold) {
        this.goto('prev');
      }
    };

    return super.events();
  }

  goto(slide) {
    switch (slide) {
      case 'next':
        this.setCurrentSlide(
          this.currentIndex + 1 < this.slides.length ? this.currentIndex + 1 : 0
        );
        break;
      case 'prev':
        this.setCurrentSlide(
          this.currentIndex - 1 !== -1
            ? this.currentIndex - 1
            : this.slides.length - 1
        );
        break;
      default:
        if (!isNaN(slide)) {
          this.setCurrentSlide(Number(slide));
        } else {
          throw new Error('Invalid slide, expected index and got:', slide);
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
    this.el.setAttribute('data-current-slide', slide);
    this.el.classList.remove(currentSlide.getAttribute('data-styling'));
    this.el.classList.add(newSlide.getAttribute('data-styling'));
    // Update Dot
    this.dots.forEach((el, i) => {
      if (i !== slide) {
        el.classList.remove('active');
      } else {
        el.classList.add('active');
      }
    });
    // Update References
    this.currentSlide = newSlide;
    this.currentIndex = slide;

    // Analytics
    this.logEvent('apps', 'show-slide', slide);
  }
}
