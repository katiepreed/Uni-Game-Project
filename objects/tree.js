function Tree(x, y, size, scale) {
  this.x = x;
  this.y = y;
  this.scaled_size = size * scale;

  this.drawTree = function () {
    fill(117, 41, 89);
    quad(
      this.x - this.scaled_size / 20,
      this.y - this.scaled_size,
      this.x + this.scaled_size / 20,
      this.y - this.scaled_size,
      this.x + this.scaled_size / 10,
      this.y,
      this.x - this.scaled_size / 10,
      this.y
    );

    fill(135, 5, 64);
    circle(
      this.x - this.scaled_size / 4,
      this.y - (this.scaled_size * 3) / 2,
      (this.scaled_size * 3) / 5
    );
    circle(
      this.x + this.scaled_size / 16,
      this.y - (this.scaled_size * 5) / 4,
      (this.scaled_size * 3) / 5
    );
    circle(
      this.x + (this.scaled_size * 5) / 16,
      this.y - (this.scaled_size * 3) / 2,
      (this.scaled_size * 3) / 5
    );
    circle(
      this.x + this.scaled_size / 16,
      this.y - (this.scaled_size * 7) / 4,
      (this.scaled_size * 3) / 5
    );

    fill(219, 83, 97);
    circle(
      this.x + this.scaled_size / 16,
      this.y - (this.scaled_size * 5) / 4,
      (this.scaled_size * 7) / 16
    );
    circle(
      this.x + (this.scaled_size * 5) / 16,
      this.y - this.scaled_size,
      (this.scaled_size * 7) / 16
    );
    circle(
      this.x + this.scaled_size / 2,
      this.y - (this.scaled_size * 9) / 8,
      (this.scaled_size * 7) / 16
    );
    circle(
      this.x + (this.scaled_size * 5) / 16,
      this.y - (this.scaled_size * 11) / 8,
      (this.scaled_size * 7) / 16
    );

    fill(230, 123, 53);
    circle(
      this.x - this.scaled_size / 16,
      this.y - (this.scaled_size * 9) / 8,
      (this.scaled_size * 7) / 16
    );
    circle(
      this.x - (this.scaled_size * 5) / 16,
      this.y - (this.scaled_size * 7) / 8,
      (this.scaled_size * 7) / 16
    );
    circle(
      this.x - this.scaled_size / 2,
      this.y - (this.scaled_size * 17) / 16,
      (this.scaled_size * 7) / 16
    );
    circle(
      this.x - (this.scaled_size * 5) / 16,
      this.y - (this.scaled_size * 5) / 4,
      (this.scaled_size * 7) / 16
    );
  };
}
