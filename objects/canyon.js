function Canyon(x, y, height, width) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.isCrossable = false;

  this.drawCanyon = function () {
    // gradient for the canyons
    var j = 0;
    for (var i = this.y; i < this.y + this.height; i++) {
      strokeWeight(10);
      stroke(208 - j / 2, 255 - j / 3, 150 - j / 4);
      line(this.x, i, this.x + this.width, i);
      j++;
    }
    noStroke();
  };
}
