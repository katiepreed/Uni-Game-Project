/* The Game Project */

var gameChar_x;
var gameChar_y;
var floorPos_y;
var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var speed;
var cameraPosX;
var inCanyon;

// Items
var collectable;
var canyon;
var tree;
var cloud;
var mountain;

function setup() {
  createCanvas(776, 576);
  floorPos_y = (height * 3) / 4;

  gameChar_x = 500;
  gameChar_y = floorPos_y;

  isLeft = false;
  isRight = false;
  isFalling = false;
  isPlummeting = false;
  speed = 3;
  cameraPosX = 0;

  collectable = {
    x_pos: 420,
    y_pos: floorPos_y - 15,
    size: 30,
    isFound: false,
  };

  canyons = {
    x_pos: [300, 800, 1200],
    y_pos: floorPos_y,
    width: 100,
  };

  trees = {
    x_pos: [50, 250, 450, 750, 1120, 1400, 1750, 1900],
    y_pos: floorPos_y,
  };

  clouds = {
    x_pos: [200, 300, 600, 800, 100, 1200, 1400, 1600, 1800, 2000],
    y_pos: [50, 200, 150, 80, 150, 20, 150, 180, 100, 200],
    size: 50,
    scale: [1, 1.5, 2, 1, 1, 1.5, 2, 1, 2, 1],
  };

  mountains = {
    x_pos: [5, 450, 600, 920, 910, 1400, 1700],
    y_pos: floorPos_y,
    size: 200,
    scale: [1.4, 1.3, 0.7, 1.4, 0.6, 1.5, 1],
  };
}

function draw() {
  background(208, 255, 150);

  noStroke();
  fill(38, 153, 145);
  rect(0, floorPos_y, width, height - floorPos_y);

  drawSun();

  push();
  translate(-cameraPosX, 0);

  canyons.x_pos.forEach((x_pos) => {
    draw_canyon(x_pos, canyons.y_pos, canyons.width);
  });

  clouds.x_pos.forEach((x_pos, i) => {
    draw_cloud(x_pos, clouds.y_pos[i], clouds.size, clouds.scale[i]);
  });

  mountains.x_pos.forEach((x_pos, i) => {
    draw_mountain(x_pos, mountains.y_pos, mountains.size, mountains.scale[i]);
  });

  trees.x_pos.forEach((x_pos) => {
    draw_tree(x_pos);
  });

  if (
    dist(gameChar_x, gameChar_y, collectable.x_pos, collectable.y_pos) <= 30
  ) {
    collectable.isFound = true;
  }

  if (!collectable.isFound) {
    collectable_draw();
  }

  fill(130, 213, 255);

  if (isLeft && isFalling) {
    charLeftFalling();
  } else if (isRight && isFalling) {
    charRightFalling();
  } else if (isLeft) {
    charLeft();
  } else if (isRight) {
    charRight();
  } else if (isFalling || isPlummeting) {
    charFrontFalling();
  } else {
    charFront();
  }

  pop();

  for (i = 0; i <= canyons.x_pos.length; i++) {
    if (
      gameChar_x > canyons.x_pos[i] + 10 &&
      gameChar_x < canyons.x_pos[i] + canyons.width - 10
    ) {
      inCanyon = true;
      break;
    } else {
      inCanyon = false;
    }
  }

  var aboveGround = gameChar_y < floorPos_y;

  if (inCanyon && !aboveGround) {
    isPlummeting = true;
  }

  if (isPlummeting) {
    gameChar_y += speed * 2;
  } else {
    if (isLeft && gameChar_x > 0) {
      gameChar_x -= speed;
      cameraPosX = gameChar_x > 500 ? cameraPosX - speed : cameraPosX;
    }

    if (isRight) {
      gameChar_x += speed;
      cameraPosX = gameChar_x > 500 ? cameraPosX + speed : cameraPosX;
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
  // "a" = go left
  if (keyCode == 65) {
    isLeft = true;
  }

  // "d" = go right
  if (keyCode == 68) {
    isRight = true;
  }

  // "w" = jump up
  if (keyCode == 87) {
    isFalling = true;

    if (gameChar_y == floorPos_y) {
      gameChar_y -= 150;
    }
  }
}

function keyReleased() {
  // "a"
  if (keyCode == 65) {
    isLeft = false;
  }

  // "d"
  if (keyCode == 68) {
    isRight = false;
  }
}

function collectable_draw() {
  noStroke();
  fill(235, 180, 52);
  circle(collectable.x_pos, collectable.y_pos, collectable.size);
  fill(252, 224, 81);
  circle(collectable.x_pos, collectable.y_pos, collectable.size - 8);
}

function drawSun() {
  fill(255, 202, 128);
  circle(10, 10, 200);
  fill(242, 255, 128);
  circle(10, 10, 180);
}

function draw_canyon(x_pos, y_pos, width) {
  noStroke();
  fill(208, 255, 150);
  rect(x_pos, y_pos, width, width * 2);
}

function draw_tree(x_pos) {
  fill(117, 41, 89);
  quad(
    x_pos - 3,
    trees.y_pos - 80,
    x_pos + 3,
    trees.y_pos - 80,
    x_pos + 8,
    trees.y_pos,
    x_pos - 8,
    trees.y_pos
  );

  fill(135, 5, 64);
  circle(x_pos - 20, trees.y_pos - 130, 44);
  circle(x_pos + 5, trees.y_pos - 110, 44);
  circle(x_pos + 25, trees.y_pos - 120, 44);
  circle(x_pos + 5, trees.y_pos - 150, 44);

  fill(219, 83, 97);
  circle(x_pos + 5, trees.y_pos - 105, 37);
  circle(x_pos + 25, trees.y_pos - 90, 37);
  circle(x_pos + 40, trees.y_pos - 100, 37);
  circle(x_pos + 25, trees.y_pos - 120, 37);

  fill(230, 123, 53);
  circle(x_pos - 5, trees.y_pos - 95, 35);
  circle(x_pos - 25, trees.y_pos - 75, 35);
  circle(x_pos - 40, trees.y_pos - 85, 35);
  circle(x_pos - 25, trees.y_pos - 105, 35);
}

function draw_cloud(x_pos, y_pos, size, scale) {
  fill(255, 255, 255);
  new_size = size * scale;

  circle(x_pos, y_pos, new_size);
  circle(
    x_pos - (8 * new_size) / 16,
    y_pos - (2 * new_size) / 16,
    (8 * new_size) / 16
  );
  circle(
    x_pos + (7 * new_size) / 16,
    y_pos - (2 * new_size) / 16,
    (6 * new_size) / 16
  );

  ellipse(
    x_pos - (12 * new_size) / 16,
    y_pos + (3 * new_size) / 16,
    (12 * new_size) / 16,
    (8 * new_size) / 16
  );

  ellipse(
    x_pos + (9 * new_size) / 16,
    y_pos + (2 * new_size) / 16,
    (12 * new_size) / 16,
    (8 * new_size) / 16
  );

  ellipse(
    x_pos,
    y_pos + (5 * new_size) / 16,
    (16 * new_size) / 16,
    (7 * new_size) / 16
  );
}

function draw_mountain(x_pos, y_pos, size, scale) {
  new_size = size * scale;

  // base
  fill(201, 181, 232);
  triangle(
    x_pos + new_size / 2,
    y_pos - new_size,
    x_pos + new_size,
    y_pos,
    x_pos,
    y_pos
  );

  // shadow
  fill(126, 123, 166);
  beginShape();
  vertex(x_pos + new_size / 2, y_pos - new_size);
  vertex(x_pos + new_size / 2, y_pos - (6 * new_size) / 8);

  // for zig-zag effect on mountain
  for (i = 6, i >= 0; i--; ) {
    x_offset = i % 2 == 0 ? 9 : 7;
    vertex(x_pos + (x_offset * new_size) / 16, y_pos - (i * new_size) / 8);
  }

  vertex(x_pos, y_pos);
  endShape();

  // top

  fill(209, 234, 255);
  beginShape();
  vertex(x_pos + new_size / 2, y_pos - new_size);
  vertex(x_pos + (6 * new_size) / 16, y_pos - (6 * new_size) / 8);
  vertex(x_pos + (8 * new_size) / 16, y_pos - (6 * new_size) / 8);
  endShape();

  fill(255, 255, 255);
  beginShape();
  vertex(x_pos + new_size / 2, y_pos - new_size);
  vertex(x_pos + (8 * new_size) / 16, y_pos - (6 * new_size) / 8);
  vertex(x_pos + (10 * new_size) / 16, y_pos - (6 * new_size) / 8);
  endShape();
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
  stroke(130, 213, 255);
  strokeWeight(3.2);
  line(gameChar_x + x1, gameChar_y + y1, gameChar_x + x2, gameChar_y + y2);
}

function bentLeg(x1, y1, x2, y2, x3, y3, x4, y4) {
  stroke(130, 213, 255);
  strokeWeight(2.8);
  line(gameChar_x + x1, gameChar_y + y1, gameChar_x + x2, gameChar_y + y2);
  line(gameChar_x + x3, gameChar_y + y3, gameChar_x + x4, gameChar_y + y4);
}

function crossedArm(x1, y1, x2, y2, x3, y3, x4, y4) {
  stroke(130, 213, 255);
  strokeWeight(3);
  line(gameChar_x + x1, gameChar_y + y1, gameChar_x + x2, gameChar_y + y2);
  line(gameChar_x + x3, gameChar_y + y3, gameChar_x + x4, gameChar_y + y4);
}

function arm(x1, y1, x2, y2) {
  stroke(130, 213, 255);
  strokeWeight(3);
  line(gameChar_x + x1, gameChar_y + y1, gameChar_x + x2, gameChar_y + y2);
}

function hand(x, y) {
  stroke(130, 213, 255);
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
