import Base from './base';

export default class Skills extends Base {
  init() {
    this.letterize(this.el.querySelector('h1'));
    return super.init(import('../../styles/header.scss')).then(() => {
      this.blobs = this.generateBlobs(this.props.numberOfBlobs);
      this.randomizeBlobCoordinates(this.blobs);
      setInterval(() => {
        requestAnimationFrame(() => this.randomizeBlobCoordinates(this.blobs));
      }, 5000);
    });
  }

  generateBlobs(numberToGenerate = 30) {
    const bg = this.el.querySelector('.background');
    const blob = bg.querySelector('.blob');
    for (let i = 0; i < numberToGenerate; i++) {
      const _blob = blob.cloneNode();
      blob.style.transform = this.getTranslateString(this.width, this.height);
      bg.appendChild(_blob);
    }
    return bg.querySelectorAll('.blob');
  }

  randomizeBlobCoordinates(blobs) {
    blobs.forEach(blob => {
      blob.style.transform = this.getTranslateString(this.width, this.height);
    });
  }

  getTranslateString(maxX, maxY) {
    const x = this._randomNumber(0, maxX);
    const y = this._randomNumber(0, maxY);
    return `translate(${x}px, ${y}px)`;
  }

  letterize(el) {
    let text = el.innerText;
    if (text && text.length) {
      text = text.split('');
      const nodes = text.map(letter => {
        const span = document.createElement('span');
        span.setAttribute('data-title', letter);
        span.innerHTML = letter;
        return span;
      });
      el.innerText = '';
      nodes.forEach(node => el.appendChild(node));
    }
    return el;
  }

  _randomNumber(min, max) {
    return Math.floor(Math.random() * max) + min;
  }

  get height() {
    return this.el.clientHeight;
  }

  get width() {
    return this.el.clientWidth;
  }
}
