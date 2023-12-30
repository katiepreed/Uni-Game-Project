/* The Game Project */

// game logic
var speed;
var in_canyon;
var lives_remaining;
var is_end_game;
var coins_collected;

// items
var collectable;
var canyons;
var trees;
var clouds;
var mountains;

// x and y coordinates
var mountains_x;
var trees_x;
var hearts_x;
var clouds_x;
var collectables_x;
var canyons_x;
var char_x;
var char_y;
var floor_y;
var camera_x;

// character behaviours
var char_left;
var char_right;
var char_falling;
var char_plummeting;

function setup() {
  createCanvas(780, 576);

  camera_x = 0;
  floor_y = 400;

  char_x = 80;
  char_y = floor_y;
  char_left = false;
  char_right = false;
  char_falling = false;
  char_plummeting = false;

  speed = 3;
  lives_remaining = 6;
  is_end_game = false;
  coins_collected = 0;

  mountains_x = [5, 30, 410, 500, 920, 910, 1400, 1700];
  trees_x = [50, 250, 450, 750, 1120, 1400, 1750, 1900];
  hearts_x = [500, 540, 580, 620, 660, 700];
  clouds_x = [200, 300, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000];
  collectables_x = [80, 180, 420, 600, 650, 780, 900, 1100, 1500, 1550, 1720];
  canyons_x = [300, 800, 1200];

  mountains = mountains_x.map((x, i) => {
    return {
      x: x,
      y: floor_y,
      size: 120,
      scale: i % 2 == 0 ? 1.5 - Math.random() : 1 + Math.random(),
    };
  });

  trees = trees_x.map((x, i) => {
    return {
      x: x,
      y: floor_y,
      size: 60,
      scale: i % 2 == 0 ? 1.8 - Math.random() : 1.2 + Math.random(),
    };
  });

  hearts = hearts_x.map((x) => {
    return {
      width: 13,
      height: 20,
      x: x,
      y: 55,
      has_life: true,
    };
  });

  clouds = clouds_x.map((x, i) => {
    return {
      x: x,
      y: i % 2 == 0 ? 120 - Math.random() * 100 : 100 + Math.random() * 100,
      size: 50,
      scale: i % 2 == 0 ? 1.5 - Math.random() : 1.2 + Math.random(),
    };
  });

  collectables = collectables_x.map((x) => {
    return {
      x: x,
      y: floor_y - 15,
      size: 30,
      isFound: false,
    };
  });

  canyons = canyons_x.map((x) => {
    return { x: x, y: floor_y, width: 100 };
  });
}

function draw() {
  background(208, 255, 150);

  drawGround();
  drawSun();

  push();
  translate(-camera_x, 0);

  canyons.forEach((canyon) => {
    drawCanyon(canyon.x, canyon.y, canyon.width);
  });

  clouds.forEach((cloud) => {
    drawCloud(cloud.x, cloud.y, cloud.size, cloud.scale);
  });

  mountains.forEach((mountain) => {
    drawMountain(mountain.x, mountain.y, mountain.size, mountain.scale);
  });

  trees.forEach((tree) => {
    drawTree(tree.x, tree.y, tree.size * tree.scale);
  });

  collectables.forEach((collectable) => {
    if (dist(char_x, char_y, collectable.x, collectable.y) <= 30) {
      if (collectable.isFound == false) {
        coins_collected += 1;
      }
      collectable.isFound = true;
    }

    if (!collectable.isFound) {
      drawCollectable(collectable.x, collectable.y, collectable.size);
    }
  });

  fill(130, 213, 255);

  if (char_left && char_falling) {
    drawCharLeftFalling();
  } else if (char_right && char_falling) {
    drawCharRightFalling();
  } else if (char_left) {
    drawCharLeft();
  } else if (char_right) {
    drawCharRight();
  } else if (char_falling || char_plummeting) {
    drawCharFrontFalling();
  } else {
    drawCharFront();
  }

  pop();

  hearts.forEach((heart) => {
    drawHeart(heart.x, heart.y, heart.width, heart.height, heart.has_life);
  });

  for (i = 0; i <= canyons.length - 1; i++) {
    if (
      char_x > canyons[i].x + 10 &&
      char_x < canyons[i].x + canyons[i].width - 10
    ) {
      in_canyon = true;
      break;
    } else {
      in_canyon = false;
    }
  }

  var aboveGround = char_y < floor_y;

  if (in_canyon && !aboveGround) {
    char_plummeting = true;
  }

  if (lives_remaining == 0) {
    is_end_game = true;
  }

  if (is_end_game) {
    drawEndGame();
  } else if (char_plummeting) {
    char_y += speed * 2;

    if (char_y >= height + 200) {
      char_x = 500;
      char_y = floor_y;
      char_plummeting = false;
      hearts[lives_remaining - 1].has_life = false;
      lives_remaining -= 1;
      camera_x = 0;
    }
  } else {
    if (char_left && char_x > 20) {
      char_x -= speed;
      camera_x = char_x > 500 && char_x < 1740 ? camera_x - speed : camera_x;
    }

    if (char_right && char_x < 2000) {
      char_x += speed;
      camera_x = char_x > 500 && char_x < 1740 ? camera_x + speed : camera_x;
    }

    if (char_falling) {
      if (aboveGround || in_canyon) {
        char_y += speed;
      } else {
        char_y = floor_y;
        char_falling = false;
      }
    }
  }
}

function keyPressed() {
  // "a" = go left
  if (keyCode == 65 && !is_end_game) {
    char_left = true;
  }

  // "d" = go right
  if (keyCode == 68 && !is_end_game) {
    char_right = true;
  }

  // "w" = jump up
  if (keyCode == 87 && !is_end_game) {
    char_falling = true;

    if (char_y == floor_y) {
      char_y -= 150;
    }
  }

  // enter
  if (keyCode == 13 && is_end_game) {
    lives_remaining = 6;
    hearts.forEach((heart) => {
      heart.has_life = true;
    });

    coins_collected = 0;
    collectables.forEach((collectable) => {
      collectable.isFound = false;
    });

    is_end_game = false;
  }
}

function keyReleased() {
  // "a"
  if (keyCode == 65) {
    char_left = false;
  }

  // "d"
  if (keyCode == 68) {
    char_right = false;
  }
}

function drawCollectable(x, y, size) {
  noStroke();
  fill(235, 180, 52);
  circle(x, y, size);
  fill(252, 224, 81);
  circle(x, y, size - 8);
}

function drawGround() {
  noStroke();
  fill(38, 153, 145);
  rect(0, floor_y, width, height - floor_y);
}

function drawSun() {
  fill(255, 202, 128);
  circle(10, 10, 200);
  fill(242, 255, 128);
  circle(10, 10, 180);
}

function drawEndGame() {
  stroke(0);
  strokeWeight(4);
  fill(255, 255, 255);

  rect_width = 560;
  x = (width - rect_width) / 2;
  rect(x, 100, 560, height / 2);

  textSize(70);
  fill(0);

  text("GAME OVER", x + 65, 200);

  textSize(20);
  strokeWeight(1);
  text("Press ENTER to RESTART", x + 160, 330);

  drawCollectable(x + rect_width / 2, 260, 60);

  fill(0);
  spacing = coins_collected > 9 ? 10 : 5;
  text(coins_collected, x - spacing + rect_width / 2, 265);
}

function drawHeart(x, y, heart_width, heart_height, has_life) {
  has_life ? fill(214, 54, 75) : fill(156, 147, 146);

  arc(x, y, heart_width, heart_height, PI, TWO_PI);
  arc(x + heart_width - 2, y, heart_width, heart_height, PI, TWO_PI);
  triangle(
    x - heart_width / 2,
    y,
    x + (3 * heart_width) / 2 - 2,
    y,
    x + heart_width / 2,
    y + heart_width
  );
}
function drawCanyon(x, y, width) {
  noStroke();
  fill(208, 255, 150);
  rect(x, y, width, width * 2);
}

function drawTree(x, y, size) {
  fill(117, 41, 89);
  quad(
    x - size / 20,
    y - size,
    x + size / 20,
    y - size,
    x + size / 10,
    y,
    x - size / 10,
    y
  );

  fill(135, 5, 64);
  circle(x - size / 4, y - (size * 3) / 2, (size * 3) / 5);
  circle(x + size / 16, y - (size * 5) / 4, (size * 3) / 5);
  circle(x + (size * 5) / 16, y - (size * 3) / 2, (size * 3) / 5);
  circle(x + size / 16, y - (size * 7) / 4, (size * 3) / 5);

  fill(219, 83, 97);
  circle(x + size / 16, y - (size * 5) / 4, (size * 7) / 16);
  circle(x + (size * 5) / 16, y - size, (size * 7) / 16);
  circle(x + size / 2, y - (size * 9) / 8, (size * 7) / 16);
  circle(x + (size * 5) / 16, y - (size * 11) / 8, (size * 7) / 16);

  fill(230, 123, 53);
  circle(x - size / 16, y - (size * 9) / 8, (size * 7) / 16);
  circle(x - (size * 5) / 16, y - (size * 7) / 8, (size * 7) / 16);
  circle(x - size / 2, y - (size * 17) / 16, (size * 7) / 16);
  circle(x - (size * 5) / 16, y - (size * 5) / 4, (size * 7) / 16);
}

function drawCloud(x, y, size, scale) {
  fill(255, 255, 255);
  new_size = size * scale;

  circle(x, y, new_size);
  circle(x - (8 * new_size) / 16, y - (2 * new_size) / 16, (8 * new_size) / 16);
  circle(x + (7 * new_size) / 16, y - (2 * new_size) / 16, (6 * new_size) / 16);

  ellipse(
    x - (12 * new_size) / 16,
    y + (3 * new_size) / 16,
    (12 * new_size) / 16,
    (8 * new_size) / 16
  );

  ellipse(
    x + (9 * new_size) / 16,
    y + (2 * new_size) / 16,
    (12 * new_size) / 16,
    (8 * new_size) / 16
  );

  ellipse(
    x,
    y + (5 * new_size) / 16,
    (16 * new_size) / 16,
    (7 * new_size) / 16
  );
}

function drawMountain(x, y, size, scale) {
  new_size = size * scale;

  // base
  fill(201, 181, 232);
  triangle(x + new_size / 2, y - new_size, x + new_size, y, x, y);

  // shadow
  fill(126, 123, 166);
  beginShape();
  vertex(x + new_size / 2, y - new_size);
  vertex(x + new_size / 2, y - (6 * new_size) / 8);

  // for zig-zag effect on mountain
  for (i = 6, i >= 0; i--; ) {
    x_offset = i % 2 == 0 ? 9 : 7;
    vertex(x + (x_offset * new_size) / 16, y - (i * new_size) / 8);
  }

  vertex(x, y);
  endShape();

  // top

  fill(209, 234, 255);
  beginShape();
  vertex(x + new_size / 2, y - new_size);
  vertex(x + (6 * new_size) / 16, y - (6 * new_size) / 8);
  vertex(x + (8 * new_size) / 16, y - (6 * new_size) / 8);
  endShape();

  fill(255, 255, 255);
  beginShape();
  vertex(x + new_size / 2, y - new_size);
  vertex(x + (8 * new_size) / 16, y - (6 * new_size) / 8);
  vertex(x + (10 * new_size) / 16, y - (6 * new_size) / 8);
  endShape();
}

function drawBody() {
  strokeWeight(0);
  ellipse(char_x, char_y - 42, 15, 30);
}

function drawHead() {
  strokeWeight(0);
  ellipse(char_x, char_y - 62, 15, 15);
}

function drawFoot(x, y, width, height) {
  strokeWeight(0);
  ellipse(char_x + x, char_y + y, width, height);
}

function drawLeg(x1, y1, x2, y2) {
  stroke(130, 213, 255);
  strokeWeight(3.2);
  line(char_x + x1, char_y + y1, char_x + x2, char_y + y2);
}

function drawBentLeg(x1, y1, x2, y2, x3, y3, x4, y4) {
  stroke(130, 213, 255);
  strokeWeight(2.8);
  line(char_x + x1, char_y + y1, char_x + x2, char_y + y2);
  line(char_x + x3, char_y + y3, char_x + x4, char_y + y4);
}

function drawCrossedArm(x1, y1, x2, y2, x3, y3, x4, y4) {
  stroke(130, 213, 255);
  strokeWeight(3);
  line(char_x + x1, char_y + y1, char_x + x2, char_y + y2);
  line(char_x + x3, char_y + y3, char_x + x4, char_y + y4);
}

function drawArm(x1, y1, x2, y2) {
  stroke(130, 213, 255);
  strokeWeight(3);
  line(char_x + x1, char_y + y1, char_x + x2, char_y + y2);
}

function drawHand(x, y) {
  stroke(130, 213, 255);
  strokeWeight(5);
  point(char_x + x, char_y + y);
}

function drawEye(x, y) {
  stroke(0);
  strokeWeight(2);
  point(char_x + x, char_y + y);
}

function drawCharFront() {
  drawHead();
  drawEye(-3, -63);
  drawEye(3, -63);

  drawBody();

  drawCrossedArm(-5, -48, -16, -44, -16, -44, -5, -38);
  drawCrossedArm(5, -48, 16, -44, 16, -44, 5, -38);

  drawLeg(-7, -5, -2, -30);
  drawLeg(7, -5, 2, -30);

  drawFoot(-10, -5, 10, 5);
  drawFoot(10, -5, 10, 5);
}

function drawCharFrontFalling() {
  drawHead();
  drawEye(-3, -63);
  drawEye(3, -63);

  drawBody();

  drawBentLeg(4, -30, 12, -25, 12, -25, 12, -18);
  drawBentLeg(-4, -30, -12, -18, -12, -18, -12, -10);

  drawFoot(-12, -10, 5, 9);
  drawFoot(12, -18, 5, 9);

  drawArm(-5, -45, -15, -58);
  drawArm(5, -45, 15, -58);

  drawHand(-15, -58);
  drawHand(15, -58);
}

function drawCharLeft() {
  drawHead();
  drawEye(-4, -63);

  drawBody();

  drawArm(-5, -45, -15, -38);
  drawHand(-15, -38);
  drawCrossedArm(5, -48, 15, -43, 15, -43, 5, -38);

  drawLeg(-8, -10, -2, -30);
  drawLeg(6, -5, 2, -30);

  drawFoot(-12, -9, 10, 5);
  drawFoot(3, -5, 10, 5);
}

function drawCharRight() {
  drawHead();
  drawEye(4, -63);

  drawBody();

  drawArm(5, -45, 15, -38);
  drawHand(15, -38);

  drawCrossedArm(-5, -48, -15, -43, -15, -43, -5, -38);

  drawLeg(8, -10, 2, -30);
  drawLeg(-6, -5, -2, -30);

  drawFoot(12, -9, 10, 5);
  drawFoot(-3, -5, 10, 5);
}

function drawCharRightFalling() {
  drawHead();
  drawEye(4, -63);

  drawBody();

  drawArm(5, -45, 15, -58);
  drawHand(15, -58);

  drawCrossedArm(-5, -48, -15, -43, -15, -43, -5, -38);

  drawBentLeg(3, -30, 12, -20, 12, -20, 3, -13);
  drawBentLeg(-3, -35, -5, -17, -5, -17, -15, -10);

  drawFoot(3, -11, 6, 8);
  drawFoot(-15, -8, 6, 8);
}

function drawCharLeftFalling() {
  drawHead();
  drawEye(-4, -63);

  drawBody();

  drawArm(-5, -45, -15, -58);
  drawHand(-15, -58);

  drawCrossedArm(5, -48, 15, -43, 15, -43, 5, -38);

  drawBentLeg(-3, -30, -12, -20, -12, -20, -3, -13);
  drawBentLeg(3, -35, 5, -17, 5, -17, 15, -10);

  drawFoot(-3, -11, 6, 8);
  drawFoot(15, -8, 6, 8);
}
