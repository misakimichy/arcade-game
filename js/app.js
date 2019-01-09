// Enemies our player must avoid
const Enemy = function(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;

    this.sprite = 'images/enemy-bug.png';
};


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt){
    //when enemy goes off the screen, enemy comes back to x = 0
    if (this.x < 505) {
        this.x += this.speed * Math.floor(Math.random()* 5 + 1) * dt + player.speedLevel;
    } else {
        this.x = -101;
    }
    
    this.checkCollisions();
};


// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.fillStyle = "black";
    ctx.font = "20px Helvetica";
    ctx.fillText("Life: " + player.playerLives, 20, 30);
    ctx.fillText("Score: "  + player.playerScore, 220, 30);
    ctx.fillText("Level: " + player.playerLevel, 420, 30);
};

// collision area:
// Enemy and player should be in the same row (y axis)
// x + some px < player.X (x axis, left side of player)
// or x > player.x + some px (x axis, right side of player)
Enemy.prototype.checkCollisions = function() {
    if (this.y === player.y && this.x + 60 > player.x && this.x < player.x + 30) {
        this.collisionHappened();
    }
};

//When collision happens, player loses a life and back to the start position.
Enemy.prototype.collisionHappened = function() {
    player.playerLives -= 1;
    player.reset();

    if (player.playerLives === 0) {
        
    }
    //To do: stop the game loop when the playerLives=0
    //To do: add game over modal
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

// Player doesn't need speed because player moves depends on the keypress event
const Player = function(x, y, allEnemies) {
    this.xMove = 101;
    this.yMove = 80;
    this.xStart = this.xMove * 2;
    this.yStart = this.yMove * 5;
    this.x = this.xStart;
    this.y = this.yStart;
    this.allEnemies = allEnemies;
    this.win = false;
    // this.star = star;

    this.playerLives = 3;
    this.playerScore = 0;
    this.playerLevel = 1;
    this.speedLevel = 1;    //change the enemy's speed level
    this.sprite = 'images/char-boy.png';
};

// check player's position
Player.prototype.update = function() {
    // Check win condition when player reach y=0
    if (this.y === 0) {
        this.win = true;
        this.gameLevel();
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// player moves a block when keypress happens
// player should stay inside the canvas
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

// reset player's position
Player.prototype.reset = function() {
    this.x = this.xStart;
    this.y = this.yStart;
};

// When player made to the river,
// Player earn score and level would goes up
// Add enemies's speed level every time the player win
// Player automatically goes back to the starting position
Player.prototype.gameLevel = function() {
    if (this.playerLevel < 3){
        this.playerScore += 30;
        this.playerLevel ++ ;
        this.speedLevel += 0.3;
        this.reset();
    } else if (this.playerLevel < 5) {
        this.playerScore += 80;
        this.playerLevel ++ ;
        this.speedLevel += 0.5;
        const bug4 = new Enemy(50, 80, 1);
        allEnemies.push(bug4);
        this.reset();
    } else {
        this.playerScore += 130;
        this.playerLevel ++ ;
        this.speedLevel += 0.8;
        this.reset();
    };

    if (this.playerScore >= 300 && star === null) {
        star = new Star();
        star.intervalId = setInterval(function() {
            star.isVisible = true;
        }, Math.floor(Math.random() * 20000));
    };
};


// TO DO: Add star to get bonus points.
const Star = function(x, y) {
    this.x = x;
    this.y = y;

    this.isVisible = false;
    this.intervalId = null;

    this.sprite = 'images/Star.png';
};

Star.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// check if player collect the star
Star.prototype.update = function(){
    if(this.y == player.y && this.x == player.x) {
        player.playerScore += 250;
        clearInterval(this.intervalId); 
        this.collisionHappened();
    }
};

// star disappear
Star.prototype.collisionHappened = function(){
    this.generateStar();
};

// Star only appears the same rows as enemies
Star.prototype.generateStar = function(){
    this.x = 101 + Math.floor(Math.random() * 4);
    this.y = 80 + Math.floor(Math.random() * 3);
};

//TO DO: Add heart to recover a life

const bug1 = new Enemy(-101, 80, 30);
const bug2 = new Enemy(404, 160, 10);
const bug3 = new Enemy(101, 240, 15);

// Place all enemy objects in an array called allEnemies
const allEnemies = [];
allEnemies.push(bug1, bug2, bug3);

const player = new Player(this.xStart, this.yStart, allEnemies);

const star = new Star(101, 80);

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


