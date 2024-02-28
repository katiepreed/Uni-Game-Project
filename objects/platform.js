function Platform(x, y) {
  this.x = x;
  this.y = y;
  this.width = 100;
  this.height = 20;

  this.drawPlaform = function () {
    fill(125, 140, 300);
    rect(this.x, this.y, this.width, this.height);
  };
}
