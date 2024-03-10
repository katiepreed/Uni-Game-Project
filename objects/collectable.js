function Collectable(x, y, size) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.isFound = false;

  this.placeOnPlatform = function (platform, special_platform_x) {
    if (
      this.x >= platform.x &&
      this.x <= platform.x + platform.width &&
      platform.x != special_platform_x
    ) {
      this.y = platform.y - size / 4;
    }
  };

  this.drawCollectable = function () {
    // glow
    for (var i = 0; i < this.size + 15; i++) {
      fill(255, 255, 255, this.size + 15 - i);
      ellipse(this.x, this.y - this.size / 2, i, 10 + i);
    }

    fill(3, 175, 255);
    beginShape();
    vertex(this.x, this.y);
    vertex(this.x - (this.size * 3) / 10, this.y - this.size / 2);
    vertex(this.x, this.y - this.size / 2);
    endShape();

    fill(168, 255, 249);
    beginShape();
    vertex(this.x - (this.size * 3) / 10, this.y - this.size / 2);
    vertex(this.x, this.y - this.size);
    vertex(this.x, this.y - this.size / 2);
    endShape();

    fill(189, 187, 252);
    beginShape();
    vertex(this.x, this.y - this.size / 2);
    vertex(this.x, this.y - this.size);
    vertex(this.x + (this.size * 3) / 10, this.y - this.size / 2);
    endShape();

    fill(48, 155, 255);
    beginShape();
    vertex(this.x, this.y - this.size / 2);
    vertex(this.x + (this.size * 3) / 10, this.y - this.size / 2);
    vertex(this.x, this.y);
    endShape();
  };
}
