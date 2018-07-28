"use strict"; // defined for global scope so I don't have to write it for every class/function
// Generates random integers between a
// given minimum and an inclusive maximum integer
var randInt = function randomInteger(min, max) {
  return Math.floor(Math.random() * max - min + 1) + min;
};

// Enemies our player must avoid
var Enemy = function(x, y) {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started
  this.x = x;
  this.y = y;
  this.speed = (Math.random() + 1.25) * 200;
  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = "images/enemy-bug.png";
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  if (this.x > 505) {
    this.x = -100 * randInt(1, 3);
    this.y = 71 * randInt(1, 3);
  } else {
    this.x += this.speed * dt;
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
  this.STEP = 50; // how far the player can move at each key stroke
  this.sprite = "images/char-boy.png";
  this.resetPos();
};

// This is a good place to update player stats
Player.prototype.update = function() {};

// Draws the player and the game over screen if the player wins
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  this.y === -20 && restartGame();
};

// Handles the key strokes (arrow keys) for game play and moves the player accordingly
// Restricts the player from moving outside the game screen
Player.prototype.handleInput = function(key) {
  switch (key) {
    case "left":
      this.x === 0 ? (this.x = 0) : (this.x -= this.STEP);
      break;
    case "up":
      this.y === -20 ? (this.y = -20) : (this.y -= this.STEP);
      break;
    case "right":
      this.x === 400 ? (this.x = 400) : (this.x += this.STEP);
      break;
    case "down":
      this.y === 430 ? (this.y = 430) : (this.y += this.STEP);
      break;
    default:
      console.log("Invalid key! Please use arrow keys!");
      break;
  }
};

// Method to reset player's position to start point
Player.prototype.resetPos = function() {
  this.defaultPos = { x: 200, y: 380 };
  this.x = this.defaultPos.x;
  this.y = this.defaultPos.y;
};

// Implement the gems class
var Gems = function(x, y) {
  var gemSprite = [
      "images/Gem Blue.png",
      "images/Gem Green.png",
      "images/Gem Orange.png"
    ],
    LEN = gemSprite.length;
  this.x = x;
  this.y = y;
  this.width = 43;
  this.height = 75;
  this.sprite = gemSprite[Math.floor(Math.random() * LEN)]; // gets a random sprite for the gem
};

// Draws the gems on the play area
Gems.prototype.render = function() {
  ctx.drawImage(
    Resources.get(this.sprite),
    this.x,
    this.y,
    this.width,
    this.height
  );
};

// Method to detect collision between player and enemies
// Resets the player to start point in case of a collision
var checkCollisions = function() {
  var COLLINT = 40; // Collision intersection
  allEnemies.forEach(enemy => {
    enemy.x <= player.x + COLLINT &&
      enemy.x + COLLINT >= player.x &&
      enemy.y <= player.y + COLLINT &&
      enemy.y + COLLINT >= player.y &&
      player.resetPos();
  });
};

// Method to collect gems
var collectGems = function() {
  var COLLINT = 30; // Collision intersection
  allGems.forEach(gem => {
    if (
      gem.x <= player.x + (COLLINT * 2 - 5) &&
      gem.x + (COLLINT * 2 - 5) >= player.x &&
      gem.y <= player.y + COLLINT - 5 &&
      gem.y + COLLINT - 5 >= player.y
    ) {
      gem.height = 0; // makes the gem disappear if the player gets to it
    }
  });
};

// Handles game over state, draws the game over screen
// Ends game play for the player after the game is over (the player cannot move)
// Restarts the game after 3.6 seconds
var restartGame = function() {
  player.handleInput = null;
  ctx.strokeStyle = "#000";
  ctx.fillStyle = "#fff";
  ctx.font = "bold 38pt Impact";
  ctx.textAlign = "center";
  ctx.lineWidth = 3;
  var x = 505 / 2,
    y = 606 / 2;
  ctx.fillText("You Won! Game Over!!", x, y);
  ctx.strokeText("You Won! Game Over!!", x, y);
  setTimeout(function() {
    window.location.reload(true);
  }, 3600);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = new Array(3).fill().map(function(enemy) {
  // get random offsets for each enemy
  var x = -100 * randInt(1, 3),
    y = 71 * randInt(1, 3);
  return new Enemy(x, y);
});

// Place all gem objects in the allGems array with random offsets
var allGems = new Array(6).fill().map(function(gem) {
  var x = 45 * randInt(1, 5),
    y = (95 + Math.floor(Math.random() * randInt(1, 10))) * randInt(1, 3);
  x += x;
  y += 18;
  return new Gems(x, y);
});

// Place the player object in a variable called player
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener("keyup", function(e) {
  var allowedKeys = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
