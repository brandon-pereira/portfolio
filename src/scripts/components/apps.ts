import Base from './base';

type GoToValue = number | 'next' | 'prev';

export default class Apps extends Base {
  currentIndex: number;
  slides: HTMLElement[];
  currentSlide: HTMLElement;
  dots: HTMLElement[];

  init(): Promise<void> {
    this.currentIndex = 0;
    this.slides = Array.from(
      this.el.querySelectorAll('.carousel-slides .carousel-slide')
    );
    this.currentSlide = this.slides[0];
    this.dots = Array.from(this.el.querySelectorAll('.carousel-dots .dot'));
    return super.init();
  }

  events(): void {
    Array.from(this.el.querySelectorAll('[data-goto]')).forEach(el =>
      el.addEventListener('click', () => {
        const goto = el.getAttribute('data-goto') as GoToValue;
        this.goto(goto);
      })
    );

    Array.from(this.el.querySelectorAll('[data-lightbox]')).forEach(el =>
      el.addEventListener('click', () => {
        const url = el.getAttribute('src');
        const raw = el.getAttribute('data-lightbox');
        const json = JSON.parse(raw);
        this.lightbox.set({
          ...json,
          url // overwrite url with parcel generated url
        });
        this.lightbox.open();
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
          handleGesture(start, end, 50);
        },
        { passive: true }
      )
    );

    const handleGesture = (
      touchstart: number,
      touchend: number,
      threshold: number
    ) => {
      if (touchend < touchstart && touchstart - touchend >= threshold) {
        this.goto('next');
      } else if (touchend > touchstart && touchend - touchstart >= threshold) {
        this.goto('prev');
      }
    };

    return super.events();
  }

  goto(slide: GoToValue): void {
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
          throw new Error(
            `Invalid slide, expected index and got ${typeof slide} ${slide}`
          );
        }
    }
  }

  setCurrentSlide(slide: number): void {
    // Get Elements
    const newSlide = this.slides[slide];
    const currentSlide = this.currentSlide;
    // Toggle classes on carousel slides
    currentSlide.classList.remove('currentSlide');
    newSlide.classList.add('currentSlide');
    // Change the main carousel styling
    this.el.setAttribute('data-current-slide', `${slide}`);
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
