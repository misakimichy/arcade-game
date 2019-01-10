// Enemies our player must avoid
const Enemy = function(x, y, speed, player) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.player = player;

    this.sprite = 'images/enemy-bug.png';
};


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt){
    //when enemy goes off the screen, enemy comes back to x = 0
    if (this.x < 505) {
        this.x += this.speed * Math.floor(Math.random()* 5 + 1) * dt + this.player.speedLevel;
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
    ctx.fillText("Life: " + this.player.playerLives, 20, 30);
    ctx.fillText("Score: "  + this.player.playerScore, 220, 30);
    ctx.fillText("Level: " + this.player.playerLevel, 420, 30);
};

// collision area:
// Enemy and player should be in the same row (y axis)
// x + some px < player.X (x axis, left side of player)
// or x > player.x + some px (x axis, right side of player)
Enemy.prototype.checkCollisions = function() {
    if (this.y === this.player.y && this.x + 60 > this.player.x && this.x < this.player.x + 30) {
        this.collisionHappened();
    }
};

//When collision happens, player loses a life and back to the start position.
Enemy.prototype.collisionHappened = function() {
    this.player.playerLives -= 1;
    this.player.reset();

    if (this.player.playerLives === 0) {
        
    }
    //To do: stop the game loop when the playerLives=0
    //To do: add game over modal
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
const Player = function(x, y) {
    this.xMove = 101;
    this.yMove = 80;
    this.xStart = this.xMove * 2;
    this.yStart = this.yMove * 5;
    this.x = this.xStart;
    this.y = this.yStart;
    this.win = false;

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


// When player made to the river,
// Player earn score depends on the player level
// Add enemies' speed level every time the player wins
// Player automatically goes back to the starting position
Player.prototype.gameLevel = function() {
    if (this.playerLevel < 3){
        this.playerScore += 30;
        this.speedLevel += 0.2;
        
    } else if (this.playerLevel < 7) {
        this.playerScore += 80;
        this.speedLevel += 0.4;
        // creating new bug doesn't work
        //const bug4 = new Enemy(50, 80, 0.8);
    
    } else {
        this.playerScore += 130;
        this.speedLevel += 0.6;  
    };
    this.playerLevel ++ ;
    this.reset();
};

// reset player's position
Player.prototype.reset = function() {
    this.x = this.xStart;
    this.y = this.yStart;
};


// Star class that player can earn bonus point
const Star = function(x, y, player) {
    this.x = x;
    this.y = y;
    this.player = player;

    this.sprite = 'images/Star.png';
};

Star.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// check if player collects the star
Star.prototype.update = function(){
    if(this.y == this.player.y && this.x == this.player.x) {
        this.player.playerScore += 250;
        this.collisionHappened();
    }
};

// star disappear
Star.prototype.collisionHappened = function(){
    this.x = 700;
    this.y = 700;

    // if (this.player.y === 80){
    //     this.generateStar();
    // }
};

// Star only appears the same rows as enemies
Star.prototype.generateStar = function(){
    const randomX = [0, 101, 202, 303, 404];
    const randomY = [80, 160, 240];
    this.x = randomX[Math.floor(Math.random() * randomX.length)];
    this.y = randomY[Math.floor(Math.random() * randomY.length)];
};

Star.prototype.reset = function() {
   
};


//TODO - Add heart to recover a life
// heart class that player can earn extra life



//TODO - add game over modal and stop game loop
// add play again button for the modal screen


(function(window) {
    console.log(window);
    const player = new Player(this.xStart, this.yStart);
    
    const bug1 = new Enemy(-101, 80, 30, player);
    const bug2 = new Enemy(404, 160, 8, player);
    const bug3 = new Enemy(101, 240, 15, player);
    
    const star = new Star(101, 80, player); 
    
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

    // TODO - engine.js shouldnt rely on window scope - below is a hack.
    // to allow engine.js to use the allEnemies variable, define here.
    // note - this is *really* bad; instead, the Engine class should take 
    // its dependencies explicitly through dependency injection (passing to the constructor).
    window.allEnemies = [bug1, bug2, bug3];
    window.player = player;
    window.star = star;
})(this);