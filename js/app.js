// Enemies our player must avoid
const Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/enemy-bug.png';
};


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
// Player doesn't need speed because player moves depends on the keypress event
const Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-boy.png';
};

Player.prototype.update = function(dt) {

};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// player moves each grid when keypress happens
Player.prototype.handleInput = function(keyPress) {
    if (keyPress == 'left' && this.x > 0){
        this.x -= 101;
    }
    if (keyPress == 'up' && this.y > 0) {
        this.y -= 83;
    }
    if (keyPress == 'right' && this.x < 400){
        this.x += 101;
    }
    if (keyPress == 'down' && this.y < 400) {
        this.y += 83;
    }
    //when player got to the top, the new game starts
    if (this.y <= 0) {
        setTimeout(() => {
            new Player(200, 400);
        }, 500);
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
const allEnemies = [new Enemy()];
const enemyLocation = [78, 160, 245];

// New enemies are created when enemy hit the right side of the canvas
enemyLocation.forEach((y) => {
    enemy = new Enemy(0, y, 200);
    allEnemies.push(enemy);
})

// Place the player object in a variable called player
// provide the original position x and y
const player = new Player(200, 400);


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
