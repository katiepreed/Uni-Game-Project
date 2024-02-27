function Endpoint(x, y) {
  this.x = x;
  this.y = y;
  this.isReached = false;

  this.reset = function () {
    this.isReached = false;
    this.y = 40;
  };

  this.drawEndpoint = function () {
    // not sure if accessing player.x as a global variable and not as a parameter is bad practice...
    var distance = abs(player.x - this.x);

    if (distance < 15 && !this.isReached) {
      this.isReached = true;
      this.y = 160;
    }

    fill(199, 38, 38);
    triangle(
      this.x,
      floor_y - this.y,
      this.x + 60,
      floor_y - this.y - 20,
      this.x,
      floor_y - this.y - 40
    );

    strokeWeight(8);
    stroke(100);
    line(this.x, floor_y - 10, this.x, floor_y - 200);
    fill(199, 146, 22);
    strokeWeight(0);
    rect(this.x - 15, floor_y - 30, 30, 30);
  };
}
