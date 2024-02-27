function Heart(x) {
  this.x = x;
  this.y = 55;
  this.width = 13;
  this.height = 20;
  this.has_life = true;

  this.drawHeart = function () {
    // the colour of the heart depends on its status
    this.has_life ? fill(214, 54, 75) : fill(156, 147, 146);

    arc(this.x, this.y, this.width, this.height, PI, TWO_PI);
    arc(this.x + this.width - 2, this.y, this.width, this.height, PI, TWO_PI);
    triangle(
      this.x - this.width / 2,
      this.y,
      this.x + (3 * this.width) / 2 - 2,
      this.y,
      this.x + this.width / 2,
      this.y + this.width
    );
  };
}
