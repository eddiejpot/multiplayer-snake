export default class Snake {
  constructor(p, setupWidth, setupHeight) {
    this.body = [];
    // make snake start from center
    this.body[0] = p.createVector(Math.floor(setupWidth / 2), Math.floor(setupHeight / 2));
    this.xDirection = 0;
    this.yDirection = 0;
    this.direction = '';
    // this is the position of the snake's head
    this.location = [this.x, this.y];
  }

  setDirection(x, y) {
    this.xDirection = x;
    this.yDirection = y;
  }

  update() {
    // head position
    const head = this.body[this.body.length - 1].copy();
    this.body.shift();
    head.x += this.xDirection;
    head.y += this.yDirection;
    this.body.push(head);

    // update direction
    const directionArr = [Math.sign(this.xDirection), Math.sign(this.yDirection)];

    const xAxis = directionArr[0];
    const yAxis = directionArr[1];

    // up
    if (xAxis === 0 && yAxis === -1) {
      this.direction = 'up';
    }
    // down
    if (xAxis === 0 && yAxis === 1) {
      this.direction = 'down';
    }
    // left
    if (xAxis === -1 && yAxis === 0) {
      this.direction = 'left';
    }
    // right
    if (xAxis === 1 && yAxis === 0) {
      this.direction = 'right';
    }

    this.location = [head.x, head.y];
  }

  grow() {
    // head position
    const head = this.body[this.body.length - 1].copy();
    this.body.push(head);
  }

  show(p) {
    const lengthOfBody = this.body.length;

    for (let i = 0; i < lengthOfBody; i += 1) {
      p.fill(248, 248, 255);
      p.noStroke();
      p.rect(this.body[i].x, this.body[i].y, 1, 1);
    }
  }
}
