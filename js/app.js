const randInt = function randomInteger(min, max) {
  return Math.floor(Math.random() * max - min + 1) + min;
};

// Enemies our player must avoid
const Enemy = function(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.speed = (Math.random() + 1.25) * 200;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
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
const Player = function() {
  this.sprite = 'images/char-boy.png';
  this.resetPos();
};

Player.prototype.update = function() {
  this.detectCollisions();
};

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
  const STEP = 50;
  (key === 'left') ? ((this.x === 0) ? this.x = 0 : this.x -= STEP) :
  (key === 'up') ? ((this.y === -20) ? this.y = -20 : this.y -= STEP) :
  (key === 'right') ? ((this.x === 400) ? this.x = 400 : this.x += STEP) :
  (key === 'down') ? ((this.y === 430) ? this.y = 430 : this.y += STEP) :
  console.log("Invalid key! Please use arrow keys!");
  console.log(this.x);
};

// Method to detect collision between player and enemies
Player.prototype.detectCollisions = function() {
  const COLLINT = 40; // Collision intersection
  allEnemies.forEach((enemy) => {
    ( enemy.x <= this.x + COLLINT &&
      enemy.x + COLLINT >= this.x &&
      enemy.y <= this.y + COLLINT &&
      enemy.y + COLLINT >= this.y ) && this.resetPos();
  });
};

// Method to reset player's position to start point
Player.prototype.resetPos = function() {
  this.defaultPos = { x: 200, y: 380 };
  this.x = this.defaultPos.x;
  this.y = this.defaultPos.y;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const allEnemies = new Array(3).fill().map((enemy) => {
  let x = -100 * randInt(1, 3);
  let y = 71 * randInt(1, 3);
  return new Enemy(x, y);
});

const player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
