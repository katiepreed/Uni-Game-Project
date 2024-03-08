function Player(x, y, colour, happy) {
  this.x = x;
  this.y = y;
  this.width = 40;
  this.jumpHeight = 192;
  this.platformHeight = 0;
  this.collidedWithEnemy = false;
  this.originalColour = colour;
  this.colour = colour;
  this.powerTime = 0;

  this.isLeft = false;
  this.isRight = false;
  this.isFalling = false;
  this.isPlummeting = false;
  this.isInvincible = false;
  this.isHappy = happy;

  this.speed = 6;
  this.lives_remaining = 3;
  this.collectables_collected = 0;
  this.in_canyon = false;
  this.aboveGround = false;
  this.onPlatform = false;
  this.canCrossBridge = false;
  this.onBridge = false;
  this.drunkPotion = false;

  this.reset = function () {
    this.isPlummeting = false;
    this.isFalling = false;
    this.lives_remaining -= 1;
    this.x = player_initial_x;
    this.y = floor_y;
    this.collidedWithEnemy = false;
    this.isInvincible = false;
    this.colour = this.originalColour;
  };

  this.newGame = function () {
    this.lives_remaining = 3;
    this.x = player_initial_x;
    this.y = floor_y;
    this.collectables_collected = 0;
    this.canCrossBridge = false;
    this.drunkPotion = false;
    this.powerTime = 0;
  };

  this.detectBridge = function (bridge_x) {
    if (this.x >= bridge_x - 80 && this.x <= bridge_x + 360) {
      this.onBridge = true;
      console.log("on bridge");
    } else {
      this.onBridge = false;
    }
  };

  this.detectEnemy = function (enemy, enemy_sound) {
    if (
      dist(this.x, this.y - 70, enemy.x, enemy.y) < 90 &&
      !this.isInvincible
    ) {
      this.collidedWithEnemy = true;
      enemy_sound.play();
    }
  };

  // if the player is near a collectable then it will be set to found
  this.detectCollectable = function (collectable, item_sound) {
    if (
      dist(this.x, this.y, collectable.x, collectable.y) <= collectable.size
    ) {
      // when the character is near a collectable, isFound is true and the number of collectables collected is incremented
      if (collectable.isFound == false) {
        this.collectables_collected += 1;
        item_sound.play();
      }
      collectable.isFound = true;
    }
  };

  // if the player is in a canyon then they will plummet
  this.detectCanyon = function (canyon, floor_y) {
    this.aboveGround = this.y < floor_y;

    if (
      this.x > canyon.x + 15 &&
      this.x < canyon.x + canyon.width - 15 &&
      !canyon.isCrossable
    ) {
      // the character can only plummet when they are on or below floor level and are in a canyon
      this.in_canyon = true;
      this.isPlummeting = !this.aboveGround;
      return true;
    } else {
      this.in_canyon = false;
    }
  };

  this.detectPotion = function (potion, boost_sound) {
    if (dist(this.x, this.y, potion.x, potion.y) < 50 && !this.drunkPotion) {
      this.isInvincible = true;
      this.drunkPotion = true;
    }

    if (this.isInvincible) {
      this.changeColour();
      frameCount % 40 == 0 && boost_sound.play();
      boost_sound.setVolume(0.2);
      this.powerTime += 1;
    }

    // the player is invincible for 5 seconds
    if (this.powerTime == 300) {
      this.isInvincible = false;
      this.colour = this.originalColour;
    }
  };

  this.detectPlatform = function (platform) {
    var nearPlatform =
      this.x >= platform.x - 30 && this.x <= platform.x + platform.width + 30;
    var onPlatform = this.y == platform.y;

    if (nearPlatform && onPlatform) {
      this.onPlatform = true;
      this.platformHeight = platform.y;
      return true;
    } else {
      this.onPlatform = false;
    }
  };

  this.moveRight = function (flag) {
    if (!flag.isReached) {
      if (this.onBridge) {
        if (this.canCrossBridge) {
          this.x += this.speed;
        }
      } else {
        this.x += this.speed;
      }
    }
  };

  this.moveLeft = function (flag) {
    if (!flag.isReached) {
      this.x -= this.speed;
    }
  };

  this.plummet = function () {
    // when the character plummets, they fall faster
    this.y += this.speed * 2;
  };

  this.fall = function () {
    // when the character is in the air, they will gradually drop
    if (this.onPlatform) {
      this.y = this.platformHeight;
    } else if (this.aboveGround || this.in_canyon) {
      this.y += this.speed;
    } else {
      // once the character has reached ground level,
      // the y_coordinate will no longer be incremented and they will no longer be falling
      this.y = floor_y;
      this.isFalling = false;
    }
  };

  this.jump = function (jump_sound) {
    this.isFalling = true;

    // to prevent double jumping
    // the character can only jump when they are on ground level
    if (this.y == floor_y || this.y == this.platformHeight) {
      this.y -= this.jumpHeight;
      jump_sound.sound.play();
    }
  };

  this.changeColour = function () {
    if (frameCount % 42 < 14) {
      this.colour = color(39, 36, 242);
    } else if (frameCount % 42 < 28) {
      this.colour = color(163, 36, 242);
    } else {
      this.colour = color(242, 36, 163);
    }
  };

  this.drawEye = function (x_offset, y_offset) {
    stroke(0);
    strokeWeight(4);
    point(this.x + x_offset, this.y + y_offset);
  };

  this.drawHand = function (x_offset, y_offset) {
    stroke(this.colour);
    strokeWeight(10);
    point(this.x + x_offset, this.y + y_offset);
  };

  this.drawArm = function (x1_offset, y1_offset, x2_offset, y2_offset) {
    stroke(this.colour);
    strokeWeight(6);
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
    stroke(this.colour);
    strokeWeight(6);
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
    stroke(this.colour);
    strokeWeight(6);
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
    stroke(this.colour);
    strokeWeight(6);
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

  this.smile = function () {
    noFill();
    stroke(0);
    strokeWeight(1);
    arc(this.x, this.y - 118, 13, 7, 0, PI);
    fill(this.colour);
  };

  this.frown = function () {
    noFill();
    stroke(0);
    strokeWeight(1);
    arc(this.x, this.y - 115, 13, 7, PI, 0);
    fill(this.colour);
  };

  this.sideSmile = function (x_offset) {
    noFill();
    stroke(0);
    strokeWeight(1);
    arc(this.x + x_offset, this.y - 118, 7, 3, 0, PI);
    fill(this.colour);
  };

  this.drawHead = function () {
    strokeWeight(0);
    ellipse(this.x, this.y - 122, 30, 30);
  };

  this.drawBody = function () {
    strokeWeight(0);
    ellipse(this.x, this.y - 84, 30, 60);
  };

  this.drawCharFront = function () {
    fill(this.colour);
    this.drawHead();
    this.drawEye(-6, -125);
    this.drawEye(6, -125);

    if (this.isHappy) {
      this.smile();
    } else {
      this.frown();
    }

    this.drawBody();

    this.drawCrossedArm(-10, -90, -32, -88, -32, -88, -10, -70);
    this.drawCrossedArm(10, -90, 32, -88, 32, -88, 10, -70);

    this.drawLeg(-14, -10, -4, -60);
    this.drawLeg(14, -10, 4, -60);

    this.drawFoot(-21, -6, 20, 10);
    this.drawFoot(21, -6, 20, 10);
  };

  this.drawCharFrontFalling = function () {
    fill(this.colour);
    this.drawHead();
    this.drawEye(-6, -126);
    this.drawEye(6, -126);
    this.smile();

    this.drawBody();

    this.drawArm(-10, -90, -30, -116);
    this.drawArm(10, -90, 30, -116);

    this.drawHand(-30, -116);
    this.drawHand(30, -116);

    this.drawBentLeg(8, -60, 24, -50, 24, -50, 24, -36);
    this.drawBentLeg(-8, -60, -24, -36, -24, -36, -24, -20);

    this.drawFoot(-24, -20, 10, 18);
    this.drawFoot(24, -36, 10, 18);
  };

  this.drawCharLeft = function () {
    fill(this.colour);
    this.drawHead();
    this.drawEye(-9, -126);

    this.sideSmile(-10);

    this.drawBody();

    this.drawArm(-10, -90, -30, -76);
    this.drawHand(-30, -76);
    this.drawCrossedArm(10, -96, 30, -86, 30, -86, 10, -76);

    this.alternateLegs("left");
  };

  this.drawCharRight = function () {
    fill(this.colour);
    this.drawHead();
    this.drawEye(7, -126);

    this.sideSmile(10);

    this.drawBody();

    this.drawArm(10, -90, 30, -76);
    this.drawHand(30, -76);
    this.drawCrossedArm(-10, -96, -30, -86, -30, -86, -10, -76);

    this.alternateLegs("right");
  };

  this.drawCharRightFalling = function () {
    fill(this.colour);

    this.drawHead();
    this.drawEye(9, -126);

    this.sideSmile(10);

    this.drawBody();

    this.drawArm(10, -90, 30, -106);
    this.drawHand(30, -109);
    this.drawCrossedArm(-10, -96, -30, -86, -30, -86, -10, -76);

    this.drawBentLeg(6, -60, 24, -40, 24, -40, 6, -26);
    this.drawBentLeg(-6, -70, -10, -32, -10, -34, -30, -20);

    this.drawFoot(6, -22, 12, 16);
    this.drawFoot(-30, -16, 12, 16);
  };

  this.drawFootFront = function (direction) {
    if (direction == "right") {
      this.drawLeg(-18, -10, -4, -60);
      this.drawLeg(18, -10, 4, -60);

      this.drawFoot(-11, -8, 20, 10);
      this.drawFoot(25, -8, 20, 10);
    } else {
      this.drawLeg(-18, -10, -4, -60);
      this.drawLeg(18, -10, 4, -60);

      this.drawFoot(-25, -8, 20, 10);
      this.drawFoot(12, -8, 20, 10);
    }
  };

  this.drawFeetTogether = function (direction) {
    if (direction == "right") {
      this.drawLeg(-8, -10, -4, -60);
      this.drawLeg(8, -10, 4, -60);

      this.drawFoot(-2, -7, 20, 10);
      this.drawFoot(14, -6, 20, 10);
    } else {
      this.drawLeg(-8, -10, -4, -60);
      this.drawLeg(8, -10, 4, -60);

      this.drawFoot(-14, -7, 20, 10);
      this.drawFoot(1, -8, 20, 10);
    }
  };

  this.alternateLegs = function (direction) {
    if (frameCount % 30 >= 15) {
      this.drawFootFront(direction);
    } else if (frameCount % 30 <= 15) {
      this.drawFeetTogether(direction);
    }
  };

  this.drawCharLeftFalling = function () {
    fill(this.colour);

    this.drawHead();
    this.drawEye(-9, -126);
    this.sideSmile(-10);

    this.drawBody();

    this.drawArm(-10, -90, -30, -116);
    this.drawHand(-30, -116);
    this.drawCrossedArm(10, -96, 30, -86, 30, -86, 10, -76);

    this.drawBentLeg(-6, -60, -24, -40, -24, -40, -6, -26);
    this.drawBentLeg(6, -70, 10, -34, 10, -34, 30, -20);

    this.drawFoot(-6, -22, 12, 16);
    this.drawFoot(30, -16, 12, 16);
  };
}
