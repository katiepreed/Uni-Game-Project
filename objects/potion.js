function Potion(x, y) {
  this.size = 40;
  this.x = x;
  this.y = y;

  this.drawPotion = function () {
    noStroke();
    fill(203, 211, 245);
    ellipse(this.x, this.y, this.size);
    rect(
      this.x - this.size / 6,
      this.y - (this.size * 8) / 10,
      this.size / 3,
      this.size / 3
    );
    ellipse(
      this.x,
      this.y - (this.size * 8) / 10,
      this.size / 2,
      this.size / 5
    );

    fill(212, 34, 15);
    arc(
      this.x,
      this.y - (3 * this.size) / 100,
      (88 * this.size) / 100,
      (94 * this.size) / 100,
      6,
      3.4,
      OPEN
    );
    fill(237, 108, 47);
    ellipse(
      this.x,
      this.y - this.size / 7,
      (84 * this.size) / 100,
      this.size / 5
    );

    fill(107, 75, 45);
    rect(
      this.x - this.size / 6,
      this.y - this.size,
      this.size / 3,
      this.size / 5
    );
    arc(
      this.x,
      this.y - (8 * this.size) / 10,
      this.size / 3,
      this.size / 12,
      0,
      PI,
      OPEN
    );

    fill(181, 132, 54);
    ellipse(this.x, this.y - this.size, this.size / 3, this.size / 12);
  };
}
