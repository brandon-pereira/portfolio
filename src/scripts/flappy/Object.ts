export type Coord = [x: number, y: number];

export type ObjectConstructorArgs = { ctx: CanvasRenderingContext2D };

export default class Object {
  ctx: CanvasRenderingContext2D;
  x: number = 0;
  y: number = 0;
  width: number = 0;
  height: number = 0;

  constructor({ ctx }: ObjectConstructorArgs) {
    this.ctx = ctx;
  }

  setPosition(coords: Coord | ((curr: Coord) => Coord)) {
    let c: Coord;
    if (typeof coords === 'function') {
      c = coords([this.x, this.y]);
    } else {
      c = coords;
    }
    this.x = c[0];
    this.y = c[1];
  }

  isIntersecting([x, y]: Coord) {
    if (
      x < this.x &&
      x > this.x + this.width &&
      y < this.y &&
      y > this.y + this.height
    ) {
      return true;
    }
    return false;
  }
}
