function Bridge(x, y) {
  this.x = x;
  this.y = y;

  this.drawBridge = function (canyon_width) {
    noFill();
    stroke(122, 83, 65);
    strokeWeight(5);

    line(this.x - 4, this.y, this.x - 4, this.y - 70);

    for (var i = 0; i < 368; i += 23) {
      line(this.x - 4 + i, this.y, this.x - 4 + i, this.y - 70);
    }
    fill(122, 83, 65);
    rect(this.x - 4, this.y + 2, canyon_width * 3 - 14, 20);
    strokeWeight(6);
    line(this.x - 2, this.y - 70, canyon_width * 3 + this.x - 20, this.y - 70);
  };

  this.drawBridgeText = function (player) {
    var colour =
      player.collectables_collected == 10
        ? color(16, 130, 18)
        : color(163, 15, 22);

    stroke(0);
    strokeWeight(10);
    fill(colour);

    var x = width / 4;
    var y = height / 4;
    var rect_width = width / 2;
    var rect_height = height / 2;

    rect(x, y, rect_width, rect_height, 20);

    textSize(18);

    fill(255, 255, 255);
    noStroke();
    text(
      "To cross the bridge you need 10 Gems!",
      x + rect_width / 12,
      y + rect_height / 4 - 30
    );
    var gemText = "You have " + player.collectables_collected + " Gems";
    text(gemText, x + rect_width / 3, y + rect_height / 2 - 40);

    var crossBridgeText =
      player.collectables_collected >= 10
        ? "You may cross the bridge!"
        : "Please collect more Gems!";

    text(crossBridgeText, x + rect_width / 5, y + (rect_height * 3) / 4 - 50);

    text(
      "Press enter to continue",
      x + rect_width / 5 + 20,
      y + rect_height - 50
    );
  };
}
