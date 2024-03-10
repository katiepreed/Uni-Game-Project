/* The Game Project */

// game logic
var canvas;
var game_over;
var level_complete;
var canyon_width;
var canyon_height;
var canyon_distance;
var floor_length;
var grass_sizes;
var bridge_logic;
var read_rules;

// items
var collectables;
var canyons;
var mountains;
var trees;
var clouds;
var flag;
var hearts;
var player;
var platforms;
var enemies;
var bridge;
var barrier;
var potion;

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
var special_platform_x;

// sounds
var item_sound;
var jump_sound;
var enemy_sound;
var background_sound;
var boost_sound;
var fall_sound;
var end_game_sound;
var game_over_sound;

// font
var font;

function preload() {
  soundFormats("mp3", "wav");

  item_sound = loadSound("sounds/item.wav");
  jump_sound = loadSound("sounds/jump.mp3");
  enemy_sound = loadSound("sounds/enemy.wav");
  background_sound = loadSound("sounds/background.mp3");

  boost_sound = loadSound("sounds/booster.wav");

  fall_sound = { sound: loadSound("sounds/fall.wav"), hasPlayed: false };
  end_game_sound = { sound: loadSound("sounds/finish.wav"), hasPlayed: false };
  game_over_sound = {
    sound: loadSound("sounds/gameOver.wav"),
    hasPlayed: false,
  };
}

function backgroundMusic() {
  background_sound.play();
  background_sound.loop();
  background_sound.setVolume(0.1);
  userStartAudio();
}

function setup() {
  canvas = createCanvas(1000, 700);
  frameRate(60);
  backgroundMusic();

  camera_x = 0;
  floor_y = 500;
  player_initial_x = 80;
  canyon_width = 120;

  game_over = false;
  level_complete = false;
  canyon_height = 200;
  // the character can only keep travelling for this many pixels
  floor_length = 3200;
  // keeps track of whether the player has read the game rules
  read_rules = false;
  grass_sizes = [];

  hearts_x = [820, 870, 920];
  mountains_x = [];
  trees_x = [];
  clouds_x = [];
  collectables_x = [];
  canyons_x = [];
  platforms_x = [];
  enemies_x = [];

  font = loadFont("assets/Gameplay.ttf");

  // x-coordinates for platforms
  for (var i = 0; i < 15; i++) {
    // leave some space bewteen every group of three platforms
    if (i % 4 != 0) {
      platforms_x.push(i * 170 + 20 + random(-20, 20));
    }
  }

  // x-coordinates for clouds
  for (var i = 1; i < 20; i++) {
    clouds_x.push(i * 150 + random(-50, 50));
  }

  // x-coordinates for enemies
  for (var i = 1; i < 5; i++) {
    enemies_x.push(i * 500 + random(-100, 100));
  }

  // distance between each canyon
  canyon_distance = 700;

  // x-coordinates for canyons
  for (var i = 1; i < 5; i++) {
    canyons_x.push(i * canyon_distance - 20);
  }

  bridge = new Bridge(2801 - canyon_width * 2, floor_y);

  // adding canyons under the bridge
  canyons_x.push(bridge.x + canyon_width);
  canyons_x.push(bridge.x);

  // x-coordinates for trees
  for (var i = 1; i < 5; i++) {
    // put trees between canyons
    // alternate between groups of two trees and groups of three trees
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
    // put collectables between canyons
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

  // adding random sizes for the grass on the ground
  for (var i = 0; i < 100; i++) {
    grass_sizes.push(random(40, 80));
  }

  flag = new Endpoint(floor_length - 100, 40, false);
  player = new Player(player_initial_x, floor_y, color(114, 229, 252), true);
  // blocks the player from crossing the bridge
  barrier = new Player(bridge.x, floor_y, color(245, 99, 88), false);

  // array of enemies
  enemies = enemies_x.map((x) => {
    return new Enemy(x);
  });

  // array of platforms
  platforms = platforms_x.map((x, i) => {
    // platforms alternate in height
    return new Platform(x, i % 2 == 0 ? floor_y - 150 : floor_y - 270, false);
  });

  // special platform: contains the potion
  special_platform_x = floor_length / 2 - 50;
  platforms.push(new Platform(special_platform_x, floor_y - 390, true));
  potion = new Potion(special_platform_x + 50, floor_y - 415);

  // array of mountains
  mountains = mountains_x.map((x, i) => {
    return new Mountain(x, floor_y, 1.2 + Math.random());
  });

  // array of trees
  trees = trees_x.map((x, i) => {
    return new Tree(
      x,
      floor_y,
      // scale alternates between ranges (1.2 to 2.2) and (1.5 to 2.5)
      // to make the trees alternate in size between small and large
      i % 2 == 0 ? 1.2 + Math.random() : 1.5 + Math.random()
    );
  });

  // array of clouds
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

  // array of hearts
  hearts = hearts_x.map((x) => {
    return new Heart(x);
  });

  // array of collectables
  collectables = collectables_x.map((x) => {
    var gem = new Collectable(x, floor_y - 10, 40);
    platforms.forEach((platform) =>
      gem.placeOnPlatform(platform, special_platform_x)
    );
    return gem;
  });

  // array of canyons
  canyons = canyons_x.map((x, i) => {
    var canyon = new Canyon(x, floor_y, canyon_height, canyon_width);
    // make the canyons under the bridge crossable, so that the player doesn't plummet when they cross the bridge
    if (i > canyons_x.length - 4) {
      canyon.isCrossable = true;
    }
    return canyon;
  });
}

function draw() {
  background(208, 255, 150); // the sky
  textFont(font);

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

  flag.drawEndpoint(player, floor_y);

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

  // only draw the person on the bridge if they player cannot cross it
  if (!player.canCrossBridge) {
    barrier.drawCharFront();
  }

  bridge.drawBridge(canyon_width);

  // only draw the potion if it hasn't been drunk
  !player.drunkPotion && potion.drawPotion();

  pop();

  player.detectPotion(potion, boost_sound);

  player.detectBridge(bridge.x);

  drawGemsCollected(player.collectables_collected);

  // the hearts will be unaffected by the scrolling of the camera
  hearts.forEach((heart) => {
    heart.drawHeart();
  });

  // returns true if player is not on the bridge, or the player can cross the bridge
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

  player.onBridge && !player.canCrossBridge && bridge.drawBridgeText(player);

  !read_rules && drawRulesText();

  // when the character has run out of lives it is the end of the game
  if (player.lives_remaining == 0) {
    game_over = true;

    if (!game_over_sound.hasPlayed) {
      game_over_sound.sound.play();
      game_over_sound.hasPlayed = true;
    }
  }

  // when the character reaches the endpoint it is the end of the game
  if (flag.flagRaised == true) {
    level_complete = true;

    if (!end_game_sound.hasPlayed) {
      end_game_sound.sound.play();
      end_game_sound.hasPlayed = true;
    }
  }

  if (game_over || level_complete) {
    drawEndGame(level_complete);
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
      player.moveLeft(flag);

      // the camera will only scroll while the character is in the middle of the screen
      camera_x =
        player.x > width / 2 && player.x < floor_length - width / 2
          ? camera_x - player.speed
          : camera_x;
    }

    if (player.isRight) {
      player.moveRight(flag);

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
  if (
    keyCode == 65 &&
    !game_over &&
    !level_complete &&
    bridge_logic &&
    !flag.isReached &&
    read_rules
  ) {
    player.isLeft = true;
  }

  // "d" = go right
  if (
    keyCode == 68 &&
    !game_over &&
    !level_complete &&
    bridge_logic &&
    !flag.isReached &&
    read_rules
  ) {
    player.isRight = true;
  }

  // "w" = jump up
  if (
    keyCode == 87 &&
    !game_over &&
    !level_complete &&
    bridge_logic &&
    !flag.isReached &&
    read_rules
  ) {
    player.jump(jump_sound);
  }

  // enter
  if (
    keyCode == 13 &&
    (game_over || level_complete || player.onBridge || !read_rules)
  ) {
    if (!read_rules) {
      read_rules = true;
    } else if (player.onBridge) {
      // just move back a bit to get rid of the pop up
      player.moveLeft(flag);

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
  // When the player presses enter at the end of the game, all the gems and hearts are reset
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
  x_coord = 0;
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

function drawGemsCollected(collectables_collected) {
  var gem = new Collectable(680, 90, 60, platforms);
  gem.drawCollectable();

  noStroke();
  textSize(35);
  fill(48, 155, 255);
  text("x " + collectables_collected, 710, 76);
}

function drawEndGame(levelComplete) {
  stroke(0);
  strokeWeight(10);
  fill(255, 255, 255);

  var x = width / 4;
  var y = height / 4;
  var rect_width = width / 2;
  var rect_height = height / 2;
  var colour = levelComplete ? color(235, 192, 52) : color(255, 0, 0);
  var size = levelComplete ? 44 : 70;
  var y_offset = levelComplete ? 20 : 0;

  rect(x, y, rect_width, rect_height, 20);
  textSize(size);
  fill(colour);
  noStroke();

  var txt = levelComplete ? "LEVEL COMPLETE" : "GAME OVER";
  text(txt, x + rect_width / 18, y + rect_height / 2 - y_offset);

  textSize(20);
  strokeWeight(1);
  fill(0);
  text(
    "Press ENTER to RESTART",
    x + rect_width / 5,
    y + (3 * rect_height) / 4 - y_offset
  );
}

function drawRulesText() {
  stroke(0);
  strokeWeight(10);
  fill(255, 255, 255);

  var x = width / 4;
  var y = height / 4;
  var rect_width = width / 2;
  var rect_height = height / 2;

  rect(x, y, rect_width, rect_height, 20);

  noStroke();
  fill(255, 0, 0);

  textSize(30);
  text("Game Rules", x + rect_width / 4 + 15, y + rect_height / 4 - 30);

  fill(0, 0, 0);
  textSize(15);
  text("Press A to go left", x + rect_width / 3 - 5, y + rect_height / 2 - 60);
  text("Press D to go right", x + rect_width / 3 - 5, y + rect_height / 2 - 35);
  text("Press W to jump", x + rect_width / 3 - 5, y + rect_height / 2 - 10);

  var potiontxt = "The potion will make you invincible for 5 seconds ";
  var flagtxt = "Reach the flag to complete the level";

  text(potiontxt, x + rect_width / 30, y + (rect_height * 3) / 4 - 50);
  text(flagtxt, x + rect_width / 7, y + (rect_height * 3) / 4 - 20);

  textSize(20);
  text("Press enter to continue", x + rect_width / 5, y + rect_height - 50);
}
