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
    //when enemy goes off the screen, enemy comes back to x = 0
    if (this.x < 505) {
        this.x += this.speedLevel * this.speed * Math.floor(Math.random()* 5 + 1) * dt;
    } 
    this.checkCollisions();
};


// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.fillStyle = "black";
    ctx.font = "20px Helvetica"
    ctx.fillText("Life: " + player.playerLives, 20, 30);
    ctx.fillText("Score: "  + player.playerScore, 220, 30);
    ctx.fillText("Level: " + this.speedLevel, 420, 30);
};

// Enemy and player should be in the same row (y axis)
// x + some px < player.X (x axis, left side of player)
// or x > player.x+30 (x axis, right side of player)
// Then collision happens
Enemy.prototype.checkCollisions = function() {
        if (this.y === player.y && 
            this.x + 60 > player.x &&
            this.x < player.x + 30) {
                this.collisionHappened();
            }
}


Enemy.prototype.collisionHappened = function() {
    player.playerLives -= 1;
    player.reset();
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

// Player doesn't need speed because player moves depends on the keypress event
const Player = function(x, y) {
    this.xMove = 101;
    this.yMove = 80;
    this.xStart = this.xMove * 2;
    this.yStart = this.yMove * 5;
    this.x = this.xStart;
    this.y = this.yStart;

    this.playerLives = 3;
    this.playerScore = 0;
    this.sprite = 'images/char-boy.png';
};

// check player's position
Player.prototype.update = function() {
    for(let enemy of allEnemies) {
        if (this.y === enemy.y) {
          
        }
        
    }


    // if (this.playerLives === 0) {
    //     this.reset();
    // }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// player moves a block when keypress happens
Player.prototype.handleInput = function(keyPress) {
    switch(keyPress) {
    case 'left':
        if (this.x > 0) {
            this.x -= this.xMove;
        };
        break;
    case 'up':
        if (this.y > 0) {
        this.y -= this.yMove;
        };
        break;
    case 'right':
        if (this.x < this.xMove * 4){
        this.x += this.xMove;
        };
        break;
    case 'down':
        if (this.y < this.yMove * 5){
        this.y += this.yMove;
        };
        break;
    }
};

Player.prototype.reset = function() {
//when player got to the top, the new game starts
    this.x = this.xStart;
    this.y = this.yStart;
};

Player.prototype.goal = function() {
    this.playerScore += 30;
    this.speedLevel += 30;
    this.reset();
}


// add function to reset game when player hit an enemy
function gameReset() {
    player.reset();
    player.playerScore = 0;
    player.speedLevel = 0;
    player.playerLives = 3;
    allEnemies = [];
    allEnemies.push(
        new Enemy(0, Math.random() * 350 + 100)
    );
}



const bug1 = new Enemy(-101, 80, 100);
const bug2 = new Enemy(-101, 160, 50);
const bug3 = new Enemy(-101, 240, 80);
// Place all enemy objects in an array called allEnemies
const allEnemies = [];
allEnemies.push(bug1, bug2, bug3);
for (let i = 0; i < 3; i++) {
    // set random start speed
    let startSpeed = this.speedLevel * Math.floor(Math.random()* 100 + 1);
    allEnemies.push(new Enemy(-100, 60 + (85 * i), startSpeed))
}

const player = new Player(this.xStart, this.yStart);


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
