// Enemies our player must avoid
class Enemy {
    constructor(y, player) {
        this.y = y;
        this.player = player;
        this.speed = null;
        this.x = null;
        
        this.sprite = 'images/enemy-bug.png';

        this.place();
    }
    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    // when enemy goes off the screen, enemy goes back to x = -101
    update(dt) {
        if (this.x < 505) {
            this.x += this.speed * Math.floor(Math.random()* 5 + 1) * dt + this.player.speedLevel;
        } else {
            this.x = -101;
        }
        this.checkCollisions();
    }

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        ctx.fillStyle = "black";
        ctx.font = "20px Helvetica";
        ctx.fillText("Life: " + this.player.playerLives, 20, 30);
        ctx.fillText("Score: "  + this.player.playerScore, 220, 30);
        ctx.fillText("Level: " + this.player.playerLevel, 420, 30);
    }

    //Enemies appear in different X with different speed
    place() {
        const randomX = [0, 101, 202, 303, 404];
        this.x = randomX[Math.floor(Math.random() * randomX.length)];
        this.speed = Math.floor(Math.random()* 30) + 1;
    }

    // Enemy and player should be in the same row (y axis)
    // x + some px < player.X (x axis, left side of player)
    // or x > player.x + some px (x axis, right side of player)
    checkCollisions() {
        if (this.y === this.player.y && this.x + 60 > this.player.x && this.x < this.player.x + 30) {
            this.crush();
        }
    }

    //When collision happens, player loses a life and back to the start position.
    crush() {
        this.player.playerLives -= 1;
        this.player.playerScore -= 50;
        this.player.reset();
    }
}

// Now write your own player class
// This class requires an update(), render() and a handleInput() method.
class Player {
    constructor(x, y) {
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
        this.speedLevel = 0.8;    //change the enemy's speed level
        this.sprite = 'images/char-boy.png';
    }

    // check player's position
    update() {
        // Check win condition when player reach to the top
        if (this.y  < 80) {
            this.win = true;
            this.gameLevel(); 
        }
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    // player moves a block and stay inside of the canvas
    handleInput(keyPress) {
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
    }

    // When the player got to the top
    // Player earn score depends on the player level
    // Add enemies' speed level every time the player wins
    // Reset player's position
    gameLevel() {
        if (this.playerLevel < 3){
            this.playerScore += 30;
            this.speedLevel += 0.2;
            
        } else if (this.playerLevel < 10) {
            this.playerScore += 40;
            this.speedLevel += 0.4;
            // creating new bug doesn't work
            //const bug4 = new Enemy(50, 80, 0.8);
        } else {
            this.playerScore += 80;
            this.speedLevel += 0.6;  
        };
        this.playerLevel ++ ;
        // make a little time rag for win = true
        setTimeout(() => {
            this.reset();
        }, 5);
    }

    // reset player's position
    reset() {
        this.x = this.xStart;
        this.y = this.yStart;
        this.win = false;
    }

    gameRestart() {
        this.playerLives = 3;
        this.playerScore = 0;
        this.playerLevel = 1;
        this.speedLevel = 1;
        this.win = false;
    }
}

// Reward class
class Reward {
    constructor(player) {
        this.player = player;
        this.x, this.y = null;
        this.sprite = null;
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    
    disappear() {
        this.x = 700;
        this.y = 700;
    }

    place() {
        const randomX = [0, 101, 202, 303, 404];
        const randomY = [80, 160, 240];
        this.x = randomX[Math.floor(Math.random() * randomX.length)];
        this.y = randomY[Math.floor(Math.random() * randomY.length)];
    }
}

// Star subclass
class Star extends Reward {
    constructor(player) {
        super(player);
        this.sprite = 'images/Star.png';

        this.update();
    }

    update() {
        if(this.player.win == true && this.player.playerLevel > 5){
            super.place();
        }
        
        if(this.y == this.player.y && this.x == this.player.x) {
            this.player.playerScore += 250;
            this.disappear();
        }
    }
}

// Heart subclass
class Heart extends Reward {
    constructor(player,star) {
        super(player);
        this.star = star;
        this.sprite = 'images/Heart.png';

        this.update();
    }

    update() {
        if(this.player.win == true && this.player.playerLives < 3){
            this.place();
        }

        if(this.y == this.player.y && this.x == this.player.x) {
            this.player.playerLives++;
            this.disappear();
        }
    }

    place() {
        super.place();
        // regenerate star when the heart will be same place as a star
        if(this.x == this.star.x && this.y == this.star.y){
            this.star.place();
        }
    }
}

(function(window) {
    const player = new Player(303, 400);
    
    const bug1 = new Enemy(80, player);
    const bug2 = new Enemy(160, player);
    const bug3 = new Enemy(240, player);
    
    const star = new Star(player); 
    const heart = new Heart(player, star);

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
    window.allEnemies = [bug1, bug2, bug3];
    window.player = player;
    window.star = star;
    window.heart = heart;
})(this);
