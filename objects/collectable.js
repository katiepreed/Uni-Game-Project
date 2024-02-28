function Collectable(x, y, size, platforms) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.isFound = false;
  this.platforms = platforms;

  this.placeOnPlatform = function (platform) {
    if (this.x >= platform.x && this.x <= platform.x + platform.width) {
      this.y = platform.y - size / 2;
    }
  };

  this.drawCollectable = function () {
    noStroke();
    fill(235, 180, 52);
    circle(this.x, this.y, this.size);
    fill(252, 224, 81);
    circle(this.x, this.y, this.size - 8);
  };
}
