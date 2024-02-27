/* The Game Project */

// game logic
var in_canyon;
var game_over;
var level_complete;
var coins_collected;
var canyon_height;
var char_width;
var char_jump_height;
var floor_length;

// items
var coins;
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
var coins_x;
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
  coins_collected = 0;
  canyon_height = 200;
  char_width = 20;
  char_jump_height = 150;
  // the character can only keep travelling for this many pixels
  floor_length = 2000;

  mountains_x = [5, 60, 410, 560, 910, 960, 1400, 1600, 1800];
  trees_x = [50, 250, 450, 750, 1120, 1400, 1750];
  hearts_x = [620, 660, 700];
  clouds_x = [200, 300, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000];
  coins_x = [180, 420, 600, 650, 780, 900, 1100, 1500, 1550, 1720];
  canyons_x = [300, 800, 1200];

  player = new Player(
    player_initial_x,
    floor_y,
    false,
    false,
    false,
    false,
    3,
    3
  );

  // array of mountain objects
  mountains = mountains_x.map((x, i) => {
    return new Mountain(
      x,
      floor_y,
      120,
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
      60,
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
      50,
      // scale alternates between ranges (0.5 to 1.5) and (1 to 2)
      // to make the clouds alternate in size between small and large
      i % 2 == 0 ? 0.5 + Math.random() : 1 + Math.random()
    );
  });

  // START: original code for hearts
  // array of heart objects
  hearts = hearts_x.map((x) => {
    return new Heart(x);
  });
  // END: original code for hearts

  // array of coin objects
  coins = coins_x.map((x) => {
    return new Collectable(x, floor_y - 15, 30);
  });

  // array of canyon objects
  canyons = canyons_x.map((x) => {
    return new Canyon(x, floor_y, 100, canyon_height);
  });

  flag = {
    x: 1900,
    y: 40,
    isReached: false,
  };
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

  coins.forEach((coin) => {
    if (dist(player.x, player.y, coin.x, coin.y) <= coin.size) {
      // when the character is near a coin, isFound is true and the number of coins collected is incremented
      if (coin.isFound == false) {
        coins_collected += 1;
      }
      coin.isFound = true;
    }

    // only draw the coin if it hasn't been found
    if (!coin.isFound) {
      coin.drawCollectable(coin.x, coin.y, coin.size);
    }
  });

  // drawPortal();
  drawFlag();

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

  drawCoinsCollected(coins_collected);

  // START: original code for hearts
  // the hearts will be unaffected by the scrolling of the camera
  hearts.forEach((heart) => {
    heart.drawHeart();
  });
  // END: original code for hearts

  // the character is in a canyon if their coordinates are in the range of a canyon
  for (i = 0; i <= canyons.length - 1; i++) {
    if (player.x > canyons[i].x && player.x < canyons[i].x + canyons[i].width) {
      in_canyon = true;
      break;
    } else {
      in_canyon = false;
    }
  }

  var aboveGround = player.y < floor_y;

  // the character can only plummet when they are on or below floor level and are in a canyon
  if (in_canyon && !aboveGround) {
    player.isPlummeting = true;
  }

  // START: original code for End of Game logic
  // when the character has run out of lives it is the end of the game
  if (player.lives_remaining == 0) {
    game_over = true;
  }

  if (flag.isReached == true) {
    level_complete = true;
  }

  if (game_over || level_complete) {
    drawEndGame(game_over, level_complete);
    // END: original code for End of Game logic
  } else if (player.isPlummeting) {
    // when the character plummets, they fall faster
    player.y += player.speed * 2;

    // START: original code for resetting character
    // when the character has fallen down the canyon, they are sent back to the starting point
    if (player.y >= height + canyon_height) {
      player.isPlummeting = false;
      player.isFalling = false;
      // the character loses a heart
      hearts[player.lives_remaining - 1].has_life = false;
      // number of lives decreases by 1
      player.lives_remaining -= 1;

      // reset character position
      camera_x = 0;
      player.x = player_initial_x;
      player.y = floor_y;
    }
    // END: original code for resetting character
  } else {
    // the player can only move left when the x-coordinate > width of the character
    if (player.isLeft && player.x > char_width) {
      player.x -= player.speed;
      // the camera will only scroll while the character is in the middle of the screen
      camera_x =
        player.x > width / 2 && player.x < floor_length - width / 2
          ? camera_x - player.speed
          : camera_x;
    }

    // the character can only move right if they haven't reached the limit of the game
    if (player.isRight && player.x < floor_length - char_width) {
      player.x += player.speed;
      // the camera will only scroll while the character is in the middle of the screen
      camera_x =
        player.x > width / 2 && player.x < floor_length - width / 2
          ? camera_x + player.speed
          : camera_x;
    }

    // when the character is falling - either from jumping or by going into a canyon
    if (player.isFalling) {
      if (aboveGround || in_canyon) {
        // when the character is in the air, they will gradually drop
        player.y += player.speed;
      } else {
        // once the character has reached ground level,
        // the y_coordinate will no longer be incremented and they will no longer be falling
        player.y = floor_y;
        player.isFalling = false;
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
    player.isFalling = true;

    // to prevent double jumping
    // the character can only jump when they are on ground level
    if (player.y == floor_y) {
      player.y -= char_jump_height;
    }
  }

  // START: original code for when player presses "enter" button
  if (keyCode == 13 && (game_over || level_complete)) {
    // When the player presses enter at the end of the game, all the coins and hearts are reset
    player.lives_remaining = 3;
    hearts.forEach((heart) => {
      heart.has_life = true;
    });

    coins_collected = 0;
    coins.forEach((coin) => {
      coin.isFound = false;
    });

    game_over = false;
    level_complete = false;
    flag.isReached = false;
    flag.y = 40;

    // reset character position
    camera_x = 0;
    player.x = player_initial_x;
    player.y = floor_y;
  }
  // END: original code for when player presses "enter" button
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

// START: original code for functions that draw all items in game

function drawPortal() {
  fill(105, 210, 255);
  ellipse(1920, floor_y - 63, 54, 124);
  for (let i = 0; i < 60; i++) {
    fill(50 + i * 7, 320, 355);
    ellipse(1920, floor_y - 63, 50 - i, 120 - i);
  }
}

function drawFlag() {
  var distance = abs(player.x - flag.x);

  if (distance < 15 && !flag.isReached) {
    console.log("flag");
    flag.isReached = true;
    flag.y = 160;
  }

  fill(199, 38, 38);
  triangle(
    flag.x,
    floor_y - flag.y,
    flag.x + 60,
    floor_y - flag.y - 20,
    flag.x,
    floor_y - flag.y - 40
  );

  strokeWeight(8);
  stroke(100);
  line(flag.x, floor_y - 10, flag.x, floor_y - 200);
  fill(199, 146, 22);
  strokeWeight(0);
  rect(flag.x - 15, floor_y - 30, 30, 30);
}

function drawCoinsCollected(coins_collected) {
  textSize(30);
  fill(255, 0, 0);
  text("Coins: " + coins_collected, 150, 60);
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

function drawEndGame(game_over, level_complete) {
  stroke(0);
  fill(255, 255, 255);

  if (game_over) {
    drawGameOver(560);
  }

  if (level_complete) {
    drawLevelComplete(450);
  }
}

function drawLevelComplete(rect_width) {
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
  spacing = coins_collected > 9 ? 10 : 5;
  text(coins_collected, x - spacing + rect_width / 2, 265);
}

function drawGameOver(rect_width) {
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
  spacing = coins_collected > 9 ? 10 : 5;
  text(coins_collected, x - spacing + rect_width / 2, 265);
}

// END: original code for functions that draw all items in game
