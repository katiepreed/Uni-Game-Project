function Cloud(x, y, scale) {
  this.x = x;
  this.y = y;
  this.size = 50;
  this.scaled_size = this.size * scale;

  this.drawCloud = function () {
    fill(255, 255, 255);

    circle(this.x, this.y, this.scaled_size);
    circle(
      this.x - this.scaled_size / 2,
      this.y - this.scaled_size / 8,
      this.scaled_size / 2
    );
    circle(
      this.x + (7 * this.scaled_size) / 16,
      this.y - this.scaled_size / 8,
      (3 * this.scaled_size) / 8
    );

    ellipse(
      this.x - (3 * this.scaled_size) / 4,
      this.y + (3 * this.scaled_size) / 16,
      (3 * this.scaled_size) / 4,
      this.scaled_size / 2
    );

    ellipse(
      this.x + (9 * this.scaled_size) / 16,
      this.y + (2 * this.scaled_size) / 16,
      (12 * this.scaled_size) / 16,
      (8 * this.scaled_size) / 16
    );

    ellipse(
      this.x,
      this.y + (5 * this.scaled_size) / 16,
      this.scaled_size,
      (7 * this.scaled_size) / 16
    );
  };
}
