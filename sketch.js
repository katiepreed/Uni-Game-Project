/* The Game Project */

// game logic
var game_over;
var level_complete;
var canyon_height;
var floor_length;

// items
var collectables;
var canyons;
var trees;
var clouds;
var flag;
var hearts;
var player;

// x and y coordinates
var mountains_x;
var trees_x;
var hearts_x;
var clouds_x;
var collectables_x;
var canyons_x;
var player_initial_x;
var floor_y;
var camera_x;

function setup() {
  createCanvas(880, 580);
  // my game operates on 60 FPS
  frameRate(60);

  camera_x = 0;
  floor_y = 400;
  player_initial_x = 80;

  game_over = false;
  level_complete = false;
  canyon_height = 200;
  // the character can only keep travelling for this many pixels
  floor_length = 2000;

  mountains_x = [5, 60, 410, 560, 910, 960, 1400, 1600, 1800];
  trees_x = [50, 250, 450, 750, 1120, 1400, 1750];
  hearts_x = [620, 660, 700];
  clouds_x = [200, 300, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000];
  collectables_x = [180, 420, 600, 650, 780, 900, 1100, 1500, 1550, 1720];
  canyons_x = [300, 800, 1200];

  flag = new Endpoint(1900, 40, false);

  player = new Player(player_initial_x, floor_y);

  // array of mountain objects
  mountains = mountains_x.map((x, i) => {
    return new Mountain(
      x,
      floor_y,
      // scale alternates between ranges (0.5 to 1.5) and (1 to 2)
      // to make mountains alternate in size between small and large
      i % 2 == 0 ? 0.5 + Math.random() : 1 + Math.random()
    );
  });

  // array of tree objects
  trees = trees_x.map((x, i) => {
    return new Tree(
      x,
      floor_y,
      // scale alternates between ranges (0.5 to 1.5) and (1 to 2)
      // to make the trees alternate in size between small and large
      i % 2 == 0 ? 0.5 + Math.random() : 1 + Math.random()
    );
  });

  // array of cloud objects
  clouds = clouds_x.map((x, i) => {
    return new Cloud(
      x,
      // y-coordinate alternates between ranges (20 to 120) and (100 to 200)
      i % 2 == 0 ? 20 + Math.random() * 100 : 100 + Math.random() * 100,
      // scale alternates between ranges (0.5 to 1.5) and (1 to 2)
      // to make the clouds alternate in size between small and large
      i % 2 == 0 ? 0.5 + Math.random() : 1 + Math.random()
    );
  });

  // array of heart objects
  hearts = hearts_x.map((x) => {
    return new Heart(x);
  });

  // array of coin objects
  collectables = collectables_x.map((x) => {
    return new Collectable(x, floor_y - 15, 30);
  });

  // array of canyon objects
  canyons = canyons_x.map((x) => {
    return new Canyon(x, floor_y, canyon_height);
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
    canyon.drawCanyon();
  });

  clouds.forEach((cloud) => {
    cloud.drawCloud();
  });

  mountains.forEach((mountain) => {
    mountain.drawMountain();
  });

  trees.forEach((tree) => {
    tree.drawTree();
  });

  collectables.forEach((collectable) => {
    // only draw the collectable if it hasn't been found
    if (!collectable.isFound) {
      collectable.drawCollectable();
    }
  });

  flag.drawEndpoint();

  // drawing the character in different states
  if (player.isLeft && player.isFalling) {
    player.drawCharLeftFalling();
  } else if (player.isRight && player.isFalling) {
    player.drawCharRightFalling();
  } else if (player.isLeft) {
    player.drawCharLeft();
  } else if (player.isRight) {
    player.drawCharRight();
  } else if (player.isFalling || player.isPlummeting) {
    player.drawCharFrontFalling();
  } else {
    player.drawCharFront();
  }

  pop();

  drawCoinsCollected(player.collectables_collected);

  // the hearts will be unaffected by the scrolling of the camera
  hearts.forEach((heart) => {
    heart.drawHeart();
  });

  player.detectCollectables();
  player.detectCanyons();

  // when the character has run out of lives it is the end of the game
  if (player.lives_remaining == 0) {
    game_over = true;
  }

  // when the character reaches the endpoint it is the end of the game
  if (flag.isReached == true) {
    level_complete = true;
  }

  if (game_over || level_complete) {
    if (game_over) {
      drawGameOver(560);
    } else if (level_complete) {
      drawLevelComplete(450);
    }
  } else if (player.isPlummeting) {
    player.plummet();

    // when the character has fallen down the canyon, they are sent back to the starting point
    if (player.y >= height + canyon_height) {
      player.reset();
      // the character loses a heart
      hearts[player.lives_remaining].has_life = false;
      // reset character position
      camera_x = 0;
    }
  } else {
    // the player can only move left when the x-coordinate > width of the character
    if (player.isLeft && player.x > player.width) {
      player.moveLeft();

      // the camera will only scroll while the character is in the middle of the screen
      camera_x =
        player.x > width / 2 && player.x < floor_length - width / 2
          ? camera_x - player.speed
          : camera_x;
    }

    // the character can only move right if they haven't reached the limit of the game
    if (player.isRight && player.x < floor_length - player.width) {
      player.moveRight();

      // the camera will only scroll while the character is in the middle of the screen
      camera_x =
        player.x > width / 2 && player.x < floor_length - width / 2
          ? camera_x + player.speed
          : camera_x;
    }

    // when the character is falling - either from jumping or by going into a canyon
    if (player.isFalling) {
      if (player.aboveGround || player.in_canyon) {
        player.fall();
      } else {
        player.onGround();
      }
    }
  }
}

function keyPressed() {
  // "a" = go left
  if (keyCode == 65 && !game_over && !level_complete) {
    player.isLeft = true;
  }

  // "d" = go right
  if (keyCode == 68 && !game_over && !level_complete) {
    player.isRight = true;
  }

  // "w" = jump up
  if (keyCode == 87 && !game_over && !level_complete) {
    player.jump();
  }

  if (keyCode == 13 && (game_over || level_complete)) {
    resetAllStats();
  }
}

function keyReleased() {
  // "a"
  if (keyCode == 65) {
    player.isLeft = false;
  }

  // "d"
  if (keyCode == 68) {
    player.isRight = false;
  }
}

function resetAllStats() {
  // When the player presses enter at the end of the game, all the coins and hearts are reset
  player.newGame();
  flag.reset();
  game_over = false;
  level_complete = false;
  camera_x = 0;

  hearts.forEach((heart) => {
    heart.has_life = true;
  });

  coins.forEach((coin) => {
    coin.isFound = false;
  });
}

function drawCoinsCollected(collectables_collected) {
  textSize(30);
  fill(255, 0, 0);
  text("Coins: " + collectables_collected, 150, 60);
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

function drawLevelComplete(rect_width) {
  stroke(0);
  fill(255, 255, 255);

  var x = (width - rect_width) / 2;
  rect(x, 100, rect_width, height / 2);

  textSize(40);
  fill(235, 192, 52);
  stroke(235, 192, 52);

  text("LEVEL COMPLETE", x + 45, 200);

  textSize(20);
  strokeWeight(1);
  stroke(0);
  fill(0);
  text("Press ENTER to RESTART", x + 105, 330);

  coin = new Collectable(x + rect_width / 2, 260, 60);
  coin.drawCollectable();

  fill(0);
  // spacing of text needs to change depending on whether the number is a double or single digit
  spacing = player.collectables_collected > 9 ? 10 : 5;
  text(player.collectables_collected, x - spacing + rect_width / 2, 265);
}

function drawGameOver(rect_width) {
  stroke(0);
  fill(255, 255, 255);

  var x = (width - rect_width) / 2;
  rect(x, 100, rect_width, height / 2);

  textSize(70);
  fill(255, 0, 0);
  noStroke();
  text("GAME OVER", x + 65, 200);

  textSize(20);
  strokeWeight(1);
  fill(0);
  text("Press ENTER to RESTART", x + 160, 330);

  coin = new Collectable(x + rect_width / 2, 260, 60);
  coin.drawCollectable();

  fill(0);
  // spacing of text needs to change depending on whether the number is a double or single digit
  spacing = player.collectables_collected > 9 ? 10 : 5;
  text(player.collectables_collected, x - spacing + rect_width / 2, 265);
}
