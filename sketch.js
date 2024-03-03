/* The Game Project */

// game logic
var game_over;
var level_complete;
var canyon_height;
var floor_length;
var grass_sizes;
var canyon_width;
var bridge_logic;

// items
var collectables;
var canyons;
var trees;
var clouds;
var flag;
var hearts;
var player;
var platforms;
var enemies;
var barrier;

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
var platforms_x;
var enemies_x;
var bridge_x;

// sounds
var jump_sound;
var fall_sound;
var end_game_sound;
var item_sound;
var enemy_sound;
var game_over_sound;
var background_sound;

function preload() {
  soundFormats("mp3", "wav");

  item_sound = loadSound("sounds/item.wav");
  enemy_sound = loadSound("sounds/enemy.wav");

  background_sound = {
    sound: loadSound("sounds/background.mp3"),
    hasPlayed: false,
  };
  fall_sound = { sound: loadSound("sounds/fall.wav"), hasPlayed: false };
  end_game_sound = { sound: loadSound("sounds/finish.wav"), hasPlayed: false };
  game_over_sound = {
    sound: loadSound("sounds/gameOver.wav"),
    hasPlayed: false,
  };
  jump_sound = { sound: loadSound("sounds/jump.mp3"), hasPlayed: false };
}

function backgroundMusic() {
  background_sound.sound.play();
  background_sound.sound.loop();
  background_sound.sound.setVolume(0.2);
  userStartAudio();
}

function setup() {
  canvas = createCanvas(1000, 700);

  // my game operates on 75 FPS
  frameRate(60);

  // backgroundMusic();

  camera_x = 0;
  floor_y = 500;
  player_initial_x = 80;
  canyon_width = 120;

  game_over = false;
  level_complete = false;
  canyon_height = 200;
  // the character can only keep travelling for this many pixels
  floor_length = 3200;

  hearts_x = [820, 870, 920];
  mountains_x = [];
  trees_x = [];
  clouds_x = [];
  collectables_x = [];
  canyons_x = [];
  platforms_x = [];
  enemies_x = [];

  for (var i = 0; i < 15; i++) {
    if (i % 4 != 0) {
      var x = i * 170 + 20;
      platforms_x.push(x + random(-20, 20));
    }
  }

  for (var i = 1; i < 20; i++) {
    clouds_x.push(i * 150 + random(-50, 50));
  }

  /*
  for (var i = 1; i < 6; i++) {
    var x = i * 400 + 20;
    enemies_x.push(x + random(-100, 100));
  }
  */

  var canyon_distance = 700;

  // adding canyons
  for (var i = 1; i < 5; i++) {
    var x = i * canyon_distance;
    canyons_x.push(x - 20);
  }

  bridge_x = 2800 - canyon_width * 2;

  canyons_x.push(bridge_x + canyon_width);
  canyons_x.push(bridge_x);

  // adding trees
  for (var i = 1; i < 5; i++) {
    var x = i * canyon_distance;
    if (i % 2 == 0) {
      trees_x.push(i * canyon_distance - 500 + random(-50, 50));
      trees_x.push((i - 1) * canyon_distance - 320 + random(-50, 50));
    } else {
      trees_x.push(i * canyon_distance - 550);
      trees_x.push((i - 1) * canyon_distance - 320);
      trees_x.push((i - 1) * canyon_distance - 100);
    }
  }

  // adding collectables
  for (var i = 1; i < 5; i++) {
    var x = i * canyon_distance;
    collectables_x.push(i * canyon_distance - 550 + random(-10, 10));
    collectables_x.push((i - 1) * canyon_distance - 320 + random(-10, 10));
    collectables_x.push((i - 1) * canyon_distance - 100 + random(-10, 10));
  }

  // adding mountains
  for (var i = 1; i < 6; i++) {
    if (i % 2 == 0) {
      mountains_x.push((i - 1) * canyon_distance - 320);
      mountains_x.push(i * canyon_distance - 550);
    } else {
      mountains_x.push(i * canyon_distance - 550);
    }
  }

  grass_sizes = [];

  for (var i = 0; i < 100; i++) {
    grass_sizes.push(random(40, 80));
  }

  flag = new Endpoint(floor_length - 100, 40, false);

  player = new Player(player_initial_x, floor_y, color(114, 229, 252));
  barrier = new Player(bridge_x, floor_y, color(52, 90, 179));

  enemies = enemies_x.map((x) => {
    return new Enemy(x);
  });

  platforms = platforms_x.map((x, i) => {
    // be careful with the platform heights because of speed
    // sometimes player.y != platform.y
    return new Platform(x, i % 2 == 0 ? floor_y - 150 : floor_y - 270);
  });

  // array of mountain objects
  mountains = mountains_x.map((x, i) => {
    return new Mountain(
      x,
      floor_y,
      // scale alternates between ranges (1 to 2) and (1.5 to 2.5)
      // to make mountains alternate in size between small and large
      1.2 + Math.random()
    );
  });

  // array of tree objects
  trees = trees_x.map((x, i) => {
    return new Tree(
      x,
      floor_y,
      // scale alternates between ranges (0.5 to 1.5) and (1 to 2)
      // to make the trees alternate in size between small and large
      i % 2 == 0 ? 1.2 + Math.random() : 1.5 + Math.random()
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
    var size = 40;
    var coin = new Collectable(x, floor_y - size / 4, size, platforms);
    platforms.forEach((platform) => coin.placeOnPlatform(platform));
    return coin;
  });

  // array of canyon objects
  canyons = canyons_x.map((x, i) => {
    var canyon = new Canyon(x, floor_y, canyon_height, canyon_width);
    if (i > canyons_x.length - 4) {
      canyon.isCrossable = true;
    }
    return canyon;
  });
}

function draw() {
  background(208, 255, 150); // the sky

  // the sun and the ground are unaffected by the scrolling of the camera
  drawGround();
  drawSun();

  push();
  translate(-camera_x, 0);

  drawGrass();

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

    player.detectCollectable(collectable, item_sound);
  });

  platforms.forEach((platform) => {
    platform.drawPlaform();
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
  } else if (player.isFalling || player.isPlummeting || player.isJumping) {
    if (player.onPlatform) {
      player.drawCharFront();
    } else {
      player.drawCharFrontFalling();
    }
  } else {
    player.drawCharFront();
  }

  enemies.forEach((enemy) => {
    enemy.drawEnemy();
    enemy.fly(floor_y, player);
    player.detectEnemy(enemy, enemy_sound);
  });

  // bridge stuff
  player.detectBridge(bridge_x);

  if (!player.canCrossBridge) {
    barrier.drawCharFront();
  }

  drawBridge(bridge_x + 1);

  pop();

  drawCoinsCollected(player.collectables_collected);

  // the hearts will be unaffected by the scrolling of the camera
  hearts.forEach((heart) => {
    heart.drawHeart();
  });

  bridge_logic = player.onBridge
    ? player.onBridge && player.canCrossBridge
    : true;

  for (i = 0; i <= platforms.length - 1; i++) {
    if (player.detectPlatform(platforms[i])) {
      break;
    }
  }

  for (i = 0; i <= canyons.length - 1; i++) {
    if (player.detectCanyon(canyons[i], floor_y)) {
      break;
    }
  }

  if (player.onBridge && !player.canCrossBridge) {
    drawBridgeText();
  }

  // when the character has run out of lives it is the end of the game
  if (player.lives_remaining == 0) {
    game_over = true;

    if (!game_over_sound.hasPlayed) {
      game_over_sound.sound.play();
      game_over_sound.hasPlayed = true;
    }
  }

  // when the character reaches the endpoint it is the end of the game
  if (flag.isReached == true) {
    level_complete = true;

    if (!end_game_sound.hasPlayed) {
      end_game_sound.sound.play();
      end_game_sound.hasPlayed = true;
    }
  }

  if (game_over || level_complete) {
    if (game_over) {
      drawGameOver(560);
    } else if (level_complete) {
      drawLevelComplete(450);
    }
  } else if (player.isPlummeting) {
    player.plummet();

    if (!fall_sound.hasPlayed) {
      fall_sound.sound.play();
      fall_sound.hasPlayed = true;
    }

    // when the character has fallen down the canyon, they are sent back to the starting point
    if (player.y >= height + canyon_height) {
      reset();
    }
  } else if (player.collidedWithEnemy) {
    reset();
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
        player.x > width / 2 &&
        player.x < floor_length - width / 2 &&
        bridge_logic
          ? camera_x + player.speed
          : camera_x;
    }

    // when the character is falling - either from jumping or by going into a canyon
    if (player.isFalling) {
      player.fall();
    }
  }
}

function keyPressed() {
  // "a" = go left
  if (keyCode == 65 && !game_over && !level_complete && bridge_logic) {
    player.isLeft = true;
  }

  // "d" = go right
  if (keyCode == 68 && !game_over && !level_complete && bridge_logic) {
    player.isRight = true;
  }

  // "w" = jump up
  if (keyCode == 87 && !game_over && !level_complete && bridge_logic) {
    player.jump(jump_sound);
  }

  if (keyCode == 13 && (game_over || level_complete || player.onBridge)) {
    if (player.onBridge) {
      player.moveLeft();
      if (player.collectables_collected == 10) {
        player.canCrossBridge = true;
      }
    } else {
      resetAllStats();
    }
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

function reset() {
  player.reset();

  enemies.forEach((enemy) => {
    enemy.reset();
  });

  // the character loses a heart
  hearts[player.lives_remaining].has_life = false;
  // reset character position
  camera_x = 0;

  fall_sound.hasPlayed = false;
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

  collectables.forEach((collectable) => {
    collectable.isFound = false;
  });

  game_over_sound.hasPlayed = false;
  end_game_sound.hasPlayed = false;
}

function drawCoinsCollected(collectables_collected) {
  var gem = new Collectable(680, 90, 60, platforms);
  gem.drawCollectable();

  textSize(35);
  stroke(48, 155, 255);
  strokeWeight(4);
  text("x " + collectables_collected, 710, 70);
  noStroke();
}

function drawGround() {
  noStroke();
  fill(53, 71, 110);
  rect(0, floor_y, width, height - floor_y);
}

function drawGrass() {
  fill(38, 153, 145);
  var x_coord = 0;
  for (var i = 0; i < grass_sizes.length; i++) {
    size = grass_sizes[i];
    arc(size / 2 + x_coord, floor_y, size, size, 0, PI, OPEN);
    x_coord += size - 10;
  }

  fill(58, 222, 175);
  var x_coord = 0;
  for (var i = 0; i < grass_sizes.length; i++) {
    size = grass_sizes[i];
    arc(size / 2 + x_coord, floor_y, size, size - 15, 0, PI, OPEN);
    x_coord += size - 10;
  }
}

function drawSun() {
  fill(255, 202, 128);
  circle(10, 10, 200);
  fill(242, 255, 128);
  circle(10, 10, 180);
}

function drawBridge(x_pos) {
  noFill();
  stroke(122, 83, 65);
  strokeWeight(5);

  line(x_pos - 4, floor_y, x_pos - 4, floor_y - 70);

  for (var i = 0; i < 368; i += 23) {
    line(x_pos - 4 + i, floor_y, x_pos - 4 + i, floor_y - 70);
  }
  fill(122, 83, 65);
  rect(x_pos - 4, floor_y + 2, canyon_width * 3 - 15, 20);
  strokeWeight(6);
  line(x_pos - 2, floor_y - 70, canyon_width * 3 + x_pos - 20, floor_y - 70);
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

  noStroke();
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

function drawBridgeText() {
  stroke(0);
  strokeWeight(6);
  fill(255, 255, 255);

  var x = width / 4;
  var y = height / 4;
  var rect_width = width / 2;
  var rect_height = height / 2;

  rect(x, y, rect_width, rect_height);

  textSize(20);

  fill(255, 0, 0);
  noStroke();
  text(
    "To cross the bridge you need 10 Gems!",
    x + rect_width / 6,
    y + rect_height / 4 - 40
  );
  var charText = "You have " + player.collectables_collected + " Gems.";
  text(charText, x + rect_width / 3, y + rect_height / 2 - 40);

  var continueText =
    player.collectables_collected >= 10
      ? "You may cross the bridge!"
      : "Please collect more Gems!";

  text(continueText, x + rect_width / 4, y + (rect_height * 3) / 4 - 40);

  text(
    "Press enter to continue.",
    x + rect_width / 3 - 15,
    y + rect_height - 40
  );
}
