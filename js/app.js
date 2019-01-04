// Enemies our player must avoid
const Enemy = function(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/enemy-bug.png';
    this.speedLevel = 1;
};


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt){
   this.x += this.speed * dt;

    //when enemy goes off the screen, enemy comes back to x = 0
    if (this.x >= 505) {
        this.x = -10;
        this.enemySpeed();
    }
    this.checkCollision();
};

Enemy.prototype.enemySpeed = function() {
    this.speed = this.speedLevel * Math.floor(Math.random() * 350 + 150);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// add collision rule
// To Do: fix the collision rule when the bottom enemy passes above the enemy
// To Do : fix when the player hits the top enemy
Enemy.prototype.checkCollision = function() {
    const playerSize = {x: player.x, y: player.y, width: 50, height: 40};
    const enemySize = {x: this.x, y: this.y, width:60, height: 70};
    if (playerSize.x < enemySize.x + enemySize.width &&
        playerSize.x + playerSize.width > enemySize.x &&
        playerSize.y > enemySize.y + enemySize.height &&
        playerSize.y + playerSize.height > enemySize.y){
            this.collisionHappened();
    }
};

Enemy.prototype.collisionHappened = function() {
    player.playerLives -= 1;
    player.reset();
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
// Player doesn't need speed because player moves depends on the keypress event
const Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-boy.png';
    this.playerLives = 3;
    this.playerScore = 0;
};

Player.prototype.update = function(dt) {
    if (this.playerLives === 0) {
        this.reset();
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// player moves each grid when keypress happens
Player.prototype.handleInput = function(keyPress) {
    switch(keyPress) {
    case 'left':
        if (this.x > 0) {
            this.x -= 101;
        };
        break;
    case 'up':
        if (this.y > 0) {
        this.y -= 83;
        };
        break;
    case 'right':
        if (this.x < 400){
        this.x += 101;
        };
        break;
    case 'down':
        if (this.y < 400){
        this.y += 83;
        };
        break;
    }
};

Player.prototype.reset = function() {
//when player got to the top, the new game starts
    this.x = 200;
    this.y = 400;
};

Player.prototype.goal = function() {
    this.playerScore += 30;
    this.speedLevel += 30;
    this.reset();

}


// add function to reset game when player hit an enemy
function gameReset() {
    player.reset();
    score = 0;
    updateDisplay();
    allEnemies = [];
    allEnemies.push(
        new Enemy(0, Math.random() * 350 + 100)
    );
}


// Place all enemy objects in an array called allEnemies
const allEnemies = [];
for (let i = 0; i < 3; i++) {
    // set random start speed
    let startSpeed = this.speedLevel * Math.floor(Math.random()* 100 + 1);
    allEnemies.push(new Enemy(0, (85 * i), startSpeed))
}

// each enemy's location on the path (y axis)
const enemyLocation = [65, 145, 230];



// Place the player object in a variable called player
// provide the original position x and y
const player = new Player(202, 400);


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


// to do list for additional
// add three lives and every time collision happened, player looses one life
