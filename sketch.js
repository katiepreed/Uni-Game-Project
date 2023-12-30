/* The Game Project */

// game logic
var speed;
var in_canyon;
var lives_remaining;
var is_end_game;
var coins_collected;
var canyon_height;
var char_width;
var char_jump_height;

// items
var coin;
var canyons;
var trees;
var clouds;
var mountains;

// x and y coordinates
var mountains_x;
var trees_x;
var hearts_x;
var clouds_x;
var coins_x;
var canyons_x;
var char_x;
var char_y;
var char_initial_x;
var floor_y;
var camera_x;

// character behaviours
var char_left;
var char_right;
var char_falling;
var char_plummeting;

function setup() {
  createCanvas(780, 580);

  camera_x = 0;
  floor_y = 400;
  char_initial_x = 80;

  char_x = char_initial_x;
  char_y = floor_y;
  char_left = false;
  char_right = false;
  char_falling = false;
  char_plummeting = false;

  speed = 3;
  lives_remaining = 6;
  is_end_game = false;
  coins_collected = 0;
  canyon_height = 200;
  char_width = 20;
  char_jump_height = 150;

  mountains_x = [5, 60, 410, 560, 910, 960, 1400, 1600, 1800];
  trees_x = [50, 250, 450, 750, 1120, 1400, 1750, 1900];
  hearts_x = [500, 540, 580, 620, 660, 700];
  clouds_x = [200, 300, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000];
  coins_x = [80, 180, 420, 600, 650, 780, 900, 1100, 1500, 1550, 1720];
  canyons_x = [300, 800, 1200];

  // array of mountain objects
  mountains = mountains_x.map((x, i) => {
    return {
      x: x,
      y: floor_y,
      size: 120,
      // scale alternates between ranges (0.5 to 1.5) and (1 to 2)
      // to make mountains alternate in size between small and large
      scale: i % 2 == 0 ? 0.5 + Math.random() : 1 + Math.random(),
    };
  });

  // array of tree objects
  trees = trees_x.map((x, i) => {
    return {
      x: x,
      y: floor_y,
      size: 60,
      // scale alternates between ranges (0.5 to 1.5) and (1 to 2)
      // to make the trees alternate in size between small and large
      scale: i % 2 == 0 ? 0.5 + Math.random() : 1 + Math.random(),
    };
  });

  // array of cloud objects
  clouds = clouds_x.map((x, i) => {
    return {
      x: x,
      // y-coordinate alternates between ranges (20 to 120) and (100 to 200)
      y: i % 2 == 0 ? 20 + Math.random() * 100 : 100 + Math.random() * 100,
      size: 50,
      // scale alternates between ranges (0.5 to 1.5) and (1 to 2)
      // to make the clouds alternate in size between small and large
      scale: i % 2 == 0 ? 0.5 + Math.random() : 1 + Math.random(),
    };
  });

  // START: original code for hearts
  // array of heart objects
  hearts = hearts_x.map((x) => {
    return {
      width: 13,
      height: 20,
      x: x,
      y: 55,
      has_life: true,
    };
  });
  // END: original code for hearts

  // array of coin objects
  coins = coins_x.map((x) => {
    return {
      x: x,
      y: floor_y - 15,
      size: 30,
      isFound: false,
    };
  });

  // array of canyon objects
  canyons = canyons_x.map((x) => {
    return { x: x, y: floor_y, width: 100, height: canyon_height };
  });
}

function draw() {
  background(208, 255, 150); // the sky

  // the sun and the ground are unaffected by the scrolling of the camera
  drawGround();
  drawSun();

  push();
  translate(-camera_x, 0);

  canyons.forEach((canyon) => {
    drawCanyon(canyon.x, canyon.y, canyon.width, canyon.height);
  });

  clouds.forEach((cloud) => {
    drawCloud(cloud.x, cloud.y, cloud.size * cloud.scale);
  });

  mountains.forEach((mountain) => {
    drawMountain(mountain.x, mountain.y, mountain.size * mountain.scale);
  });

  trees.forEach((tree) => {
    drawTree(tree.x, tree.y, tree.size * tree.scale);
  });

  coins.forEach((coin) => {
    if (dist(char_x, char_y, coin.x, coin.y) <= coin.size) {
      // when the character is near a coin, isFound is true and the number of coins collected is incremented
      if (coin.isFound == false) {
        coins_collected += 1;
      }
      coin.isFound = true;
    }

    // only draw the coin if it hasn't been found
    if (!coin.isFound) {
      drawCoin(coin.x, coin.y, coin.size);
    }
  });

  // drawing the character in different states
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

  // START: original code for hearts
  // the hearts will be unaffected by the scrolling of the camera
  hearts.forEach((heart) => {
    drawHeart(heart.x, heart.y, heart.width, heart.height, heart.has_life);
  });
  // END: original code for hearts

  // the character is in a canyon if their coordinates are in the range of a canyon
  for (i = 0; i <= canyons.length - 1; i++) {
    if (char_x > canyons[i].x && char_x < canyons[i].x + canyons[i].width) {
      in_canyon = true;
      break;
    } else {
      in_canyon = false;
    }
  }

  var aboveGround = char_y < floor_y;

  // the character can only plummet when they are on or below floor level and are in a canyon
  if (in_canyon && !aboveGround) {
    char_plummeting = true;
  }

  // START: original code for End of Game logic
  // when the character has run out of lives it is the end of the game
  if (lives_remaining == 0) {
    is_end_game = true;
  }

  if (is_end_game) {
    drawEndGame();
    // END: original code for End of Game logic
  } else if (char_plummeting) {
    // when the character plummets, they fall faster
    char_y += speed * 2;

    // START: original code for resetting character
    // when the character has fallen down the canyon, they are sent back to the starting point
    if (char_y >= height + canyon_height) {
      // reset character position
      camera_x = 0;
      char_x = char_initial_x;
      char_y = floor_y;
      char_plummeting = false;
      // the character loses a heart
      hearts[lives_remaining - 1].has_life = false;
      // number of lives decreases by 1
      lives_remaining -= 1;
    }
    // END: original code for resetting character
  } else {
    // the player can only move left when the x-coordinate > width of the character
    if (char_left && char_x > char_width) {
      char_x -= speed;
      // the camera will only scroll while the character is in the middle of the screen
      camera_x =
        char_x > width / 2 && char_x < floor_length - width / 2
          ? camera_x - speed
          : camera_x;
    }

    // the character can only keep travelling for this many pixels
    floor_length = 2000;

    // the character can only move right if they haven't reached the limit of the game
    if (char_right && char_x < floor_length - char_width) {
      char_x += speed;
      // the camera will only scroll while the character is in the middle of the screen
      camera_x =
        char_x > width / 2 && char_x < floor_length - width / 2
          ? camera_x + speed
          : camera_x;
    }

    // to simulate jumping
    if (char_falling) {
      if (aboveGround || in_canyon) {
        // when the character is in the air, they will gradually drop
        char_y += speed;
      } else {
        // once the character has reached ground level,
        // the y_coordinate will no longer be incremented and they will no longer be falling
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
      char_y -= char_jump_height;
    }
  }

  // START: original code for when player presses "enter" button
  if (keyCode == 13 && is_end_game) {
    // When the player presses enter at the end of the game, all the coins and hearts are reset
    lives_remaining = 6;
    hearts.forEach((heart) => {
      heart.has_life = true;
    });

    coins_collected = 0;
    coins.forEach((coin) => {
      coin.isFound = false;
    });

    is_end_game = false;
  }
  // END: original code for when player presses "enter" button
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

// START: Original code for functions that draw all items in game
function drawCoin(x, y, size) {
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

  drawCoin(x + rect_width / 2, 260, 60);

  fill(0);
  // spacing of text needs to change depending on whether the number is a double or single digit
  spacing = coins_collected > 9 ? 10 : 5;
  text(coins_collected, x - spacing + rect_width / 2, 265);
}

function drawHeart(x, y, heart_width, heart_height, has_life) {
  // the colour of the heart depends on its status
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

function drawCanyon(x, y, width, height) {
  noStroke();
  fill(208, 255, 150);
  rect(x, y, width, height);
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

function drawCloud(x, y, size) {
  fill(255, 255, 255);

  circle(x, y, size);
  circle(x - (8 * size) / 16, y - (2 * size) / 16, (8 * size) / 16);
  circle(x + (7 * size) / 16, y - (2 * size) / 16, (6 * size) / 16);

  ellipse(
    x - (12 * size) / 16,
    y + (3 * size) / 16,
    (12 * size) / 16,
    (8 * size) / 16
  );

  ellipse(
    x + (9 * size) / 16,
    y + (2 * size) / 16,
    (12 * size) / 16,
    (8 * size) / 16
  );

  ellipse(x, y + (5 * size) / 16, (16 * size) / 16, (7 * size) / 16);
}

function drawMountain(x, y, size) {
  // base
  fill(201, 181, 232);
  triangle(x + size / 2, y - size, x + size, y, x, y);

  // shadow
  fill(126, 123, 166);
  beginShape();
  vertex(x + size / 2, y - size);
  vertex(x + size / 2, y - (6 * size) / 8);

  // for zig-zag effect on mountain
  for (i = 6, i >= 0; i--; ) {
    x_offset = i % 2 == 0 ? 9 : 7;
    vertex(x + (x_offset * size) / 16, y - (i * size) / 8);
  }

  vertex(x, y);
  endShape();

  // top
  fill(209, 234, 255);
  beginShape();
  vertex(x + size / 2, y - size);
  vertex(x + (6 * size) / 16, y - (6 * size) / 8);
  vertex(x + (8 * size) / 16, y - (6 * size) / 8);
  endShape();

  fill(255, 255, 255);
  beginShape();
  vertex(x + size / 2, y - size);
  vertex(x + (8 * size) / 16, y - (6 * size) / 8);
  vertex(x + (10 * size) / 16, y - (6 * size) / 8);
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
  fill(130, 213, 255);
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
  fill(130, 213, 255);
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
  fill(130, 213, 255);
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
  fill(130, 213, 255);
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
  fill(130, 213, 255);

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
  fill(130, 213, 255);

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
// END: Original code for functions that draw all items in game
