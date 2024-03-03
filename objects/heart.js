function Heart(x) {
  this.x = x;
  this.y = 55;
  this.width = 20;
  this.height = 23;
  this.has_life = true;

  this.drawHeart = function () {
    // the colour of the heart depends on its status
    this.has_life ? fill(214, 54, 75) : fill(156, 147, 146);

    arc(this.x, this.y, this.width, this.height, 0, TWO_PI);
    arc(this.x + this.width - 2, this.y, this.width, this.height, 0, TWO_PI);

    var triangle_width = this.width;

    triangle(
      this.x - triangle_width / 2 + 0.2,
      this.y + 5,
      this.x + (3 * triangle_width) / 2 - 1.8,
      this.y + 4,
      this.x + triangle_width / 2,
      this.y + triangle_width + 4
    );
  };
}
