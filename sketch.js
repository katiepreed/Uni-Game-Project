/* The Game Project */

var gameChar_x;
var gameChar_y;
var floorPos_y;
var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var speed;
var collectable;
var canyon;

function setup() {
  createCanvas(1024, 576);
  floorPos_y = (height * 3) / 4;
  gameChar_x = width / 2;
  gameChar_y = floorPos_y;

  // These variables will be used to animate your game character.
  isLeft = false;
  isRight = false;
  isFalling = false;
  isPlummeting = false;
  speed = 3;

  collectable = {
    x_pos: 420,
    y_pos: floorPos_y - 15,
    size: 30,
    isFound: false,
  };

  canyon = {
    x_pos: 300,
    y_pos: floorPos_y,
    width: 100,
  };
}

function draw() {
  background(100, 155, 255); //fill the sky blue

  noStroke();
  fill(0, 155, 0);
  rect(0, floorPos_y, width, height - floorPos_y); //draw some green ground

  //draw the canyon
  canyon_draw();

  if (
    distance(gameChar_x, gameChar_y, collectable.x_pos, collectable.y_pos) <= 30
  ) {
    collectable.isFound = true;
  }

  if (!collectable.isFound) {
    collectable_draw();
  }

  // character fill
  fill(255, 255, 255);

  //the game character
  if (isLeft && isFalling) {
    // add your jumping-left code
    charLeftFalling();
  } else if (isRight && isFalling) {
    // add your jumping-right code
    charRightFalling();
  } else if (isLeft) {
    // add your walking left code
    charLeft();
  } else if (isRight) {
    // add your walking right code
    charRight();
  } else if (isFalling || isPlummeting) {
    // add your jumping facing forwards code
    charFrontFalling();
  } else {
    // add your standing front facing code
    charFront();
  }

  var inCanyon = gameChar_x >= 310 && gameChar_x <= 390;
  var aboveGround = gameChar_y < floorPos_y;

  if (inCanyon && !aboveGround) {
    isPlummeting = true;
  }

  if (isPlummeting) {
    gameChar_y += speed * 2;
  } else {
    if (isLeft) {
      gameChar_x -= speed;
    }

    if (isRight) {
      gameChar_x += speed;
    }

    if (isFalling) {
      if (aboveGround || inCanyon) {
        gameChar_y += speed;
      } else {
        gameChar_y = floorPos_y;
        isFalling = false;
      }
    }
  }
}

function keyPressed() {
  // if statements to control the animation of the character when
  // keys are pressed.

  console.log("keyPressed: " + key);
  console.log("keyPressed: " + keyCode);

  // a - go left
  if (keyCode == 65) {
    isLeft = true;
  }

  // d - go right
  if (keyCode == 68) {
    isRight = true;
  }

  // w - jump up
  if (keyCode == 87) {
    isFalling = true;

    if (gameChar_y == floorPos_y) {
      gameChar_y -= 100;
    }
  }
}

function keyReleased() {
  // if statements to control the animation of the character when
  // keys are released.

  console.log("keyReleased: " + key);
  console.log("keyReleased: " + keyCode);

  // a
  if (keyCode == 65) {
    isLeft = false;
  }

  // d
  if (keyCode == 68) {
    isRight = false;
  }
}

function distance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

function collectable_draw() {
  noStroke();
  fill(235, 180, 52);
  circle(collectable.x_pos, collectable.y_pos, collectable.size);
  fill(252, 224, 81);
  circle(collectable.x_pos, collectable.y_pos, collectable.size - 8);
}

function canyon_draw() {
  noStroke();
  fill(100, 155, 255);
  rect(canyon.x_pos, canyon.y_pos, canyon.width, canyon.width * 2);
}
function body() {
  strokeWeight(0);
  ellipse(gameChar_x, gameChar_y - 42, 15, 30);
}

function head() {
  strokeWeight(0);
  ellipse(gameChar_x, gameChar_y - 62, 15, 15);
}

function foot(x, y, width, height) {
  strokeWeight(0);
  ellipse(gameChar_x + x, gameChar_y + y, width, height);
}

function leg(x1, y1, x2, y2) {
  stroke(255, 255, 255);
  strokeWeight(3.2);
  line(gameChar_x + x1, gameChar_y + y1, gameChar_x + x2, gameChar_y + y2);
}

function bentLeg(x1, y1, x2, y2, x3, y3, x4, y4) {
  stroke(255, 255, 255);
  strokeWeight(2.8);
  line(gameChar_x + x1, gameChar_y + y1, gameChar_x + x2, gameChar_y + y2);
  line(gameChar_x + x3, gameChar_y + y3, gameChar_x + x4, gameChar_y + y4);
}

function crossedArm(x1, y1, x2, y2, x3, y3, x4, y4) {
  stroke(255, 255, 255);
  strokeWeight(3);
  line(gameChar_x + x1, gameChar_y + y1, gameChar_x + x2, gameChar_y + y2);
  line(gameChar_x + x3, gameChar_y + y3, gameChar_x + x4, gameChar_y + y4);
}

function arm(x1, y1, x2, y2) {
  stroke(255, 255, 255);
  strokeWeight(3);
  line(gameChar_x + x1, gameChar_y + y1, gameChar_x + x2, gameChar_y + y2);
}

function hand(x, y) {
  stroke(255, 255, 255);
  strokeWeight(5);
  point(gameChar_x + x, gameChar_y + y);
}

function eye(x, y) {
  stroke(0);
  strokeWeight(2);
  point(gameChar_x + x, gameChar_y + y);
}

function charFront() {
  head();
  eye(-3, -63);
  eye(3, -63);

  body();

  crossedArm(-5, -48, -16, -44, -16, -44, -5, -38);
  crossedArm(5, -48, 16, -44, 16, -44, 5, -38);

  leg(-7, -5, -2, -30);
  leg(7, -5, 2, -30);

  foot(-10, -5, 10, 5);
  foot(10, -5, 10, 5);
}

function charFrontFalling() {
  head();
  eye(-3, -63);
  eye(3, -63);

  body();

  bentLeg(4, -30, 12, -25, 12, -25, 12, -18);
  bentLeg(-4, -30, -12, -18, -12, -18, -12, -10);

  foot(-12, -10, 5, 9);
  foot(12, -18, 5, 9);

  arm(-5, -45, -15, -58);
  arm(5, -45, 15, -58);

  hand(-15, -58);
  hand(15, -58);
}

function charLeft() {
  head();
  eye(-4, -63);

  body();

  arm(-5, -45, -15, -38);
  hand(-15, -38);
  crossedArm(5, -48, 15, -43, 15, -43, 5, -38);

  leg(-8, -10, -2, -30);
  leg(6, -5, 2, -30);

  foot(-12, -9, 10, 5);
  foot(3, -5, 10, 5);
}

function charRight() {
  head();
  eye(4, -63);

  body();

  arm(5, -45, 15, -38);
  hand(15, -38);

  crossedArm(-5, -48, -15, -43, -15, -43, -5, -38);

  leg(8, -10, 2, -30);
  leg(-6, -5, -2, -30);

  foot(12, -9, 10, 5);
  foot(-3, -5, 10, 5);
}

function charRightFalling() {
  head();
  eye(4, -63);

  body();

  arm(5, -45, 15, -58);
  hand(15, -58);

  crossedArm(-5, -48, -15, -43, -15, -43, -5, -38);

  bentLeg(3, -30, 12, -20, 12, -20, 3, -13);
  bentLeg(-3, -35, -5, -17, -5, -17, -15, -10);

  foot(3, -11, 6, 8);
  foot(-15, -8, 6, 8);
}

function charLeftFalling() {
  head();
  eye(-4, -63);

  body();

  arm(-5, -45, -15, -58);
  hand(-15, -58);

  crossedArm(5, -48, 15, -43, 15, -43, 5, -38);

  bentLeg(-3, -30, -12, -20, -12, -20, -3, -13);
  bentLeg(3, -35, 5, -17, 5, -17, 15, -10);

  foot(-3, -11, 6, 8);
  foot(15, -8, 6, 8);
}
