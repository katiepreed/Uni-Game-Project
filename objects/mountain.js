function Mountain(x, y, size, scale) {
  this.x = x;
  this.y = y;
  this.scaled_size = size * scale;

  this.drawMountain = function () {
    // base
    fill(201, 181, 232);
    triangle(
      this.x + this.scaled_size / 2,
      y - this.scaled_size,
      this.x + this.scaled_size,
      y,
      this.x,
      y
    );

    // shadow
    fill(126, 123, 166);
    beginShape();
    vertex(this.x + this.scaled_size / 2, this.y - this.scaled_size);
    vertex(this.x + this.scaled_size / 2, this.y - (3 * this.scaled_size) / 4);

    // for zig-zag effect on mountain
    for (i = 6, i >= 0; i--; ) {
      var x_offset = i % 2 == 0 ? 9 : 7;
      vertex(
        this.x + (x_offset * this.scaled_size) / 16,
        this.y - (i * this.scaled_size) / 8
      );
    }

    vertex(this.x, this.y);
    endShape();

    // top
    fill(209, 234, 255);
    beginShape();
    vertex(this.x + this.scaled_size / 2, this.y - this.scaled_size);
    vertex(
      this.x + (3 * this.scaled_size) / 8,
      this.y - (3 * this.scaled_size) / 4
    );
    vertex(this.x + this.scaled_size / 2, this.y - (3 * this.scaled_size) / 4);
    endShape();

    fill(255, 255, 255);
    beginShape();
    vertex(this.x + this.scaled_size / 2, this.y - this.scaled_size);
    vertex(this.x + this.scaled_size / 2, this.y - (3 * this.scaled_size) / 4);
    vertex(
      this.x + (5 * this.scaled_size) / 8,
      this.y - (3 * this.scaled_size) / 4
    );
    endShape();
  };
}
