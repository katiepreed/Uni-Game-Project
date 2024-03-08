function Platform(x, y, isSpecial) {
  this.x = x;
  this.y = y;
  this.width = 106;
  this.grassSize = 20;
  this.isSpecial = isSpecial;

  this.drawPlaform = function () {
    /* base*/
    let col = this.isSpecial ? color(247, 190, 74) : color(53, 71, 110);
    fill(col);

    triangle(
      this.x,
      this.y,
      this.x + 20,
      this.y + this.width / 2 - 20,
      this.x + this.width - 20,
      this.y
    );

    triangle(
      this.x + 15,
      this.y,
      this.x + this.width / 2,
      this.y + this.width / 2,
      this.x + this.width - 15,
      this.y
    );

    triangle(
      this.x + 30,
      this.y,
      this.x + this.width,
      this.y,
      this.x + this.width - 20,
      this.y + 30
    );

    let col2 = this.isSpecial ? color(252, 231, 71) : color(71, 95, 145);
    fill(col2);

    triangle(
      this.x,
      this.y,
      this.x + 22,
      this.y + this.width / 2 - 30,
      this.x + this.width - 15,
      this.y
    );

    triangle(
      this.x + 15,
      this.y,
      this.x + this.width / 2,
      this.y + this.width / 2 - 20,
      this.x + this.width - 15,
      this.y
    );

    triangle(
      this.x + 30,
      this.y,
      this.x + this.width,
      this.y,
      this.x + this.width - 20,
      this.y + 20
    );

    /* grass */
    var x_coord = this.x;

    let col3 = this.isSpecial ? color(145, 138, 90) : color(38, 153, 145);
    fill(col3);
    for (var i = 0; i < 6; i++) {
      arc(
        this.grassSize / 2 + x_coord,
        this.y,
        this.grassSize,
        this.grassSize + 10,
        0,
        PI,
        OPEN
      );
      x_coord += this.grassSize - 3;
    }

    x_coord = this.x;

    let col4 = this.isSpecial ? color(245, 208, 115) : color(10, 207, 167);
    fill(col4);
    for (var i = 0; i < 6; i++) {
      arc(
        this.grassSize / 2 + x_coord,
        this.y,
        this.grassSize,
        this.grassSize,
        0,
        PI,
        OPEN
      );
      x_coord += this.grassSize - 3;
    }
  };
}
