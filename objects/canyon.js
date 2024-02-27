function Canyon(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;

  this.drawCanyon = function () {
    noStroke();
    fill(208, 255, 150);
    rect(this.x, this.y, this.width, this.height);
  };
}
