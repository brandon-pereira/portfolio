import Object from './Object';

export default class Character extends Object {
  override width: number = 100;
  override height: number = 100;
  override x = 200;
  override y = 300;

  render() {
    this.ctx.fillStyle = '#E9D912';
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
