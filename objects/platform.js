function Platform(x, y) {
  this.x = x;
  this.y = y;
  this.width = 106;
  this.grassSize = 20;

  this.drawPlaform = function () {
    /* base*/
    fill(53, 71, 110);

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

    fill(71, 95, 145);

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

    fill(38, 153, 145);
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

    fill(10, 207, 167);
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
