import Object, { type Coord, type ObjectConstructorArgs } from './Object';

export default class Barricade extends Object {
  holeTop: number;
  holeBottom: number;
  override width = 100;
  override x = -100;

  constructor(args: ObjectConstructorArgs) {
    super(args);

    this.holeTop = Math.random();
    this.holeBottom = this.holeTop + 0.2;
  }

  get computedTop() {
    const bounds = document.body.getBoundingClientRect();
    return bounds.height * this.holeTop;
  }

  get computedBottom() {
    const bounds = document.body.getBoundingClientRect();
    return bounds.height * this.holeBottom;
  }

  render() {
    this.ctx.fillStyle = '#793609';
    this.ctx.fillRect(this.x, 0, this.width, this.computedTop);
    this.ctx.fillRect(
      this.x,
      this.computedBottom,
      this.width,
      window.innerHeight
    );
  }

  override isIntersecting([x, y]: Coord) {
    if (x <= this.x || x >= this.x + this.width) {
      return false;
    }
    console.log('x overlap');
    if (y >= this.computedTop && y <= this.computedBottom) {
      return false;
    }
    console.log('y overlap');
    return true;
  }
}
