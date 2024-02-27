function Player(
  x,
  y,
  isLeft,
  isRight,
  isFalling,
  isPlummeting,
  speed,
  lives_remaining
) {
  this.x = x;
  this.y = y;

  this.isLeft = isLeft;
  this.isRight = isRight;
  this.isFalling = isFalling;
  this.isPlummeting = isPlummeting;

  this.speed = speed;
  this.lives_remaining = lives_remaining;

  this.drawEye = function (x_offset, y_offset) {
    stroke(0);
    strokeWeight(2);
    point(this.x + x_offset, this.y + y_offset);
  };

  this.drawHand = function (x_offset, y_offset) {
    stroke(130, 213, 255);
    strokeWeight(5);
    point(this.x + x_offset, this.y + y_offset);
  };

  this.drawArm = function (x1_offset, y1_offset, x2_offset, y2_offset) {
    stroke(130, 213, 255);
    strokeWeight(3);
    line(
      this.x + x1_offset,
      this.y + y1_offset,
      this.x + x2_offset,
      this.y + y2_offset
    );
  };

  this.drawCrossedArm = function (
    x1_offset,
    y1_offset,
    x2_offset,
    y2_offset,
    x3_offset,
    y3_offset,
    x4_offset,
    y4_offset
  ) {
    stroke(130, 213, 255);
    strokeWeight(3);
    line(
      this.x + x1_offset,
      this.y + y1_offset,
      this.x + x2_offset,
      this.y + y2_offset
    );
    line(
      this.x + x3_offset,
      this.y + y3_offset,
      this.x + x4_offset,
      this.y + y4_offset
    );
  };

  this.drawBentLeg = function (
    x1_offset,
    y1_offset,
    x2_offset,
    y2_offset,
    x3_offset,
    y3_offset,
    x4_offset,
    y4_offset
  ) {
    stroke(130, 213, 255);
    strokeWeight(2.8);
    line(
      this.x + x1_offset,
      this.y + y1_offset,
      this.x + x2_offset,
      this.y + y2_offset
    );
    line(
      this.x + x3_offset,
      this.y + y3_offset,
      this.x + x4_offset,
      this.y + y4_offset
    );
  };

  this.drawLeg = function (x1_offset, y1_offset, x2_offset, y2_offset) {
    stroke(130, 213, 255);
    strokeWeight(3.2);
    line(
      this.x + x1_offset,
      this.y + y1_offset,
      this.x + x2_offset,
      this.y + y2_offset
    );
  };

  this.drawFoot = function (x_offset, y_offset, width, height) {
    strokeWeight(0);
    ellipse(this.x + x_offset, this.y + y_offset, width, height);
  };

  this.drawHead = function () {
    strokeWeight(0);
    ellipse(this.x, this.y - 62, 15, 15);
  };

  this.drawBody = function () {
    strokeWeight(0);
    ellipse(this.x, this.y - 42, 15, 30);
  };

  this.drawCharFront = function () {
    fill(130, 213, 255);
    this.drawHead();
    this.drawEye(-3, -63);
    this.drawEye(3, -63);

    this.drawBody();

    this.drawCrossedArm(-5, -48, -16, -44, -16, -44, -5, -38);
    this.drawCrossedArm(5, -48, 16, -44, 16, -44, 5, -38);

    this.drawLeg(-7, -5, -2, -30);
    this.drawLeg(7, -5, 2, -30);

    this.drawFoot(-10, -5, 10, 5);
    this.drawFoot(10, -5, 10, 5);
  };

  this.drawCharFrontFalling = function () {
    fill(130, 213, 255);
    this.drawHead();
    this.drawEye(-3, -63);
    this.drawEye(3, -63);

    this.drawBody();

    this.drawArm(-5, -45, -15, -58);
    this.drawArm(5, -45, 15, -58);

    this.drawHand(-15, -58);
    this.drawHand(15, -58);

    this.drawBentLeg(4, -30, 12, -25, 12, -25, 12, -18);
    this.drawBentLeg(-4, -30, -12, -18, -12, -18, -12, -10);

    this.drawFoot(-12, -10, 5, 9);
    this.drawFoot(12, -18, 5, 9);
  };

  this.drawCharLeft = function () {
    fill(130, 213, 255);
    this.drawHead();
    this.drawEye(-4, -63);

    this.drawBody();

    this.drawArm(-5, -45, -15, -38);
    this.drawHand(-15, -38);
    this.drawCrossedArm(5, -48, 15, -43, 15, -43, 5, -38);

    this.drawLeg(-8, -10, -2, -30);
    this.drawLeg(6, -5, 2, -30);

    this.drawFoot(-12, -9, 10, 5);
    this.drawFoot(3, -5, 10, 5);
  };

  this.drawCharRight = function () {
    fill(130, 213, 255);
    this.drawHead();
    this.drawEye(4, -63);

    this.drawBody();

    this.drawArm(5, -45, 15, -38);
    this.drawHand(15, -38);
    this.drawCrossedArm(-5, -48, -15, -43, -15, -43, -5, -38);

    this.drawLeg(8, -10, 2, -30);
    this.drawLeg(-6, -5, -2, -30);

    this.drawFoot(12, -9, 10, 5);
    this.drawFoot(-3, -5, 10, 5);
  };

  this.drawCharRightFalling = function () {
    fill(130, 213, 255);

    this.drawHead();
    this.drawEye(4, -63);

    this.drawBody();

    this.drawArm(5, -45, 15, -58);
    this.drawHand(15, -58);
    this.drawCrossedArm(-5, -48, -15, -43, -15, -43, -5, -38);

    this.drawBentLeg(3, -30, 12, -20, 12, -20, 3, -13);
    this.drawBentLeg(-3, -35, -5, -17, -5, -17, -15, -10);

    this.drawFoot(3, -11, 6, 8);
    this.drawFoot(-15, -8, 6, 8);
  };

  this.drawCharLeftFalling = function () {
    fill(130, 213, 255);

    this.drawHead();
    this.drawEye(-4, -63);

    this.drawBody();

    this.drawArm(-5, -45, -15, -58);
    this.drawHand(-15, -58);
    this.drawCrossedArm(5, -48, 15, -43, 15, -43, 5, -38);

    this.drawBentLeg(-3, -30, -12, -20, -12, -20, -3, -13);
    this.drawBentLeg(3, -35, 5, -17, 5, -17, 15, -10);

    this.drawFoot(-3, -11, 6, 8);
    this.drawFoot(15, -8, 6, 8);
  };
}
