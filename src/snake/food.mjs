export default class Food {
  constructor(p) {
    this.body = p.createVector(0, 0);
    this.x = 0;
    this.y = 0;
    this.location = [this.x, this.y];
  }

  setLocation(width, height) {
    this.x = Math.floor(Math.random() * width);
    this.y = Math.floor(Math.random() * height);
    this.location = [this.x, this.y];
  }

  show(p) {
    p.fill(255, 0, 0);
    p.noStroke();
    p.rect(this.x, this.y, 1, 1);
  }
}
