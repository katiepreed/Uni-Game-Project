function Enemy(x) {
  this.x = x;
  this.y = 0;
  this.alive = true;
  this.size = 25;
  this.speed = random(1, 2);

  this.fly = function (floor_y) {
    var dist_floor = dist(this.x, this.y, this.x, floor_y);

    if (dist_floor < 10) {
      this.y = 0;
    } else {
      this.y += this.speed;
      this.x += random(-this.speed, this.speed);
    }
  };

  this.reset = function () {
    this.y = 0;
  };

  this.drawEnemy = function () {
    // base
    fill(176, 9, 17);
    arc(
      this.x,
      this.y + this.size,
      (this.size * 89) / 20,
      this.size * 2,
      PI + 0.1,
      TWO_PI - 0.1,
      OPEN
    );
    fill(128, 5, 11);
    arc(
      this.x,
      this.y + (this.size * 3) / 4,
      (this.size * 173) / 40,
      (this.size * 5) / 4,
      0,
      PI,
      OPEN
    );
    fill(176, 9, 17);
    arc(
      this.x,
      this.y + (this.size * 3) / 4,
      (this.size * 173) / 40,
      (this.size * 4) / 5,
      0,
      PI,
      OPEN
    );

    // face
    fill(0, 0, 0);
    noStroke();
    circle(this.x, this.y, this.size);

    stroke(255, 255, 0);
    strokeWeight(3);
    point(this.x - this.size / 5, this.y - this.size / 8, 1);
    point(this.x + this.size / 5, this.y - this.size / 8, 1);

    // stripe
    noFill();
    stroke(194, 194, 188);
    strokeWeight(8);
    arc(this.x, this.y + 5, this.size * 2, this.size / 2, 0, PI, OPEN);

    // top
    fill(34, 30, 156, 170);
    noStroke();
    arc(
      this.x,
      this.y + this.size / 8,
      this.size * 2,
      this.size * 2,
      PI,
      0,
      OPEN
    );
    arc(
      this.x,
      this.y + this.size / 8,
      this.size * 2,
      this.size / 2,
      0,
      PI,
      OPEN
    );

    // glow
    noStroke();
    for (var i = 0; i < 30; i++) {
      fill(255, 255, 0, 30 - i);
      ellipse(
        this.x - this.size,
        this.y + (this.size * 3) / 4,
        i * 1.5,
        i * 1.5
      );
      ellipse(
        this.x + this.size,
        this.y + (this.size * 3) / 4,
        i * 1.5,
        i * 1.5
      );
    }

    // lights
    fill(255, 255, 255);
    ellipse(this.x - this.size, this.y + (this.size * 3) / 4, 12);
    ellipse(this.x + this.size, this.y + (this.size * 3) / 4, 12);
    noStroke();
  };
}
