import Base from './base';
import animate from '../lib/animate';

export default class Apps extends Base {
  init() {
    return super
      .init()
      .then(() => this.injectSvg())
      .then(() => this.animateSvg())
      .catch(err => console.error(err));
  }

  injectSvg() {
    const container = document.createElement('div');
    container.classList.add('svg-coder');
    const injectAfter = this.el.querySelector('p');
    injectAfter.parentNode.insertBefore(container, injectAfter.nextSibling);
    return import('../../static/coder.svg').then(svg => {
      container.innerHTML = svg;
      container.classList.add('loaded');
    });
  }

  animateSvg() {
    animate(
      this.el.querySelector('#coder g#arm'),
      [
        { transform: 'translateY(-5px)' },
        { transform: 'translateX(-20px) translateY(0px)', offset: 0.2 },
        { transform: 'translateX(-20px) translateY(0px)', offset: 0.6 },
        { transform: 'translateY(-5px)' }
      ],
      {
        // timing options
        duration: 2000,
        direction: 'alternate',
        iterations: Infinity,
        easing: 'linear'
      }
    );

    animate(
      this.el.querySelectorAll('#coder g#monitor-one-code *'),
      [
        {
          transform: 'translateY(-10px)',
          opacity: 0
        },
        {
          transform: 'translateY(0px)',
          opacity: 1,
          offset: 0.5
        },
        {
          transform: 'translateY(0px)',
          opacity: 1
        }
      ],
      {
        duration: 10000,
        iterations: Infinity,
        iterationDelay: i => i * 100,
        easing: 'linear',
        fill: 'both'
      }
    );

    animate(
      this.el.querySelectorAll('#coder g#monitor-two-code *'),
      [
        {
          transform: 'translateY(-10px)',
          opacity: 0
        },
        {
          transform: 'translateY(0px)',
          opacity: 1,
          offset: 0.5
        },
        {
          transform: 'translateY(0px)',
          opacity: 1
        }
      ],
      {
        duration: 1500,
        iterations: Infinity,
        iterationDelay: i => i * 10,
        easing: 'linear',
        fill: 'both'
      }
    );
  }
}
