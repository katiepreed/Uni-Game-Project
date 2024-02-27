function Collectable(x, y, size) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.isFound = false;

  this.drawCollectable = function () {
    noStroke();
    fill(235, 180, 52);
    circle(this.x, this.y, this.size);
    fill(252, 224, 81);
    circle(this.x, this.y, this.size - 8);
  };
}
