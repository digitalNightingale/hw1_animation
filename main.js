/*
 * Leah Ruisenor
 * 
 * TCSS 491
 * Winter 2018
 * HW 1 - Annimation
 * 
 */

/*************
 * Animation *
 *************/

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
        xindex * this.frameWidth, yindex * this.frameHeight,
        this.frameWidth, this.frameHeight,
        x, y,
        this.frameWidth * this.scale,
        this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

/**************
 * Background *
 **************/

function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet, this.x, this.y);
};

Background.prototype.update = function () {
};

/******************
 * Princess Zelda *
 ******************/

function Zelda(game, spritesheet) {
    this.animation = new Animation(spritesheet, 144, 60.965, 5, .5, 21, true, 2);
    this.speed = 25; //350
    this.ctx = game.ctx;
    Entity.call(this, game, -60, 245);
}

Zelda.prototype = new Entity();
Zelda.prototype.constructor = Zelda;

Zelda.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

Zelda.prototype.update = function () {
    if (this.animation.elapsedTime < this.animation.totalTime * 10 / 21) {
        this.x += this.game.clockTick * this.speed;
    } else if (this.x > 800) {
        this.x = -230;
    } else {
        if (this.animation.elapsedTime < this.animation.totalTime * 11 / 21) {
        } else {
            this.x += (this.game.clockTick * this.speed) * -1;
            if (this.animation.elapsedTime < this.animation.totalTime * 18 / 21) {
            } else {
                this.x -= (this.game.clockTick * this.speed) * -1;

            }
        }
    }
}

/*******
 * Cat *
 *******/

function Cat(game, spritesheet) {
    this.animation = new Animation(spritesheet, 32, 32, 379, 0.5, 6, true, 1.5);
    this.speed = 25;
    this.ctx = game.ctx;
    Entity.call(this, game, 800, 325);
}

Cat.prototype = new Entity();
Cat.prototype.constructor = Cat;

Cat.prototype.update = function () {
    if (this.animation.elapsedTime > this.animation.totalTime * 3 / 6) {
        // stop the first time
    } else if (this.x < -800) {
        this.x = 230;
    } else {
        this.x -= this.game.clockTick * this.speed;
        if (this.x < -100) this.x = 800; // 800 = is where the cat starts on the right side 2nd time
    }
    Entity.prototype.update.call(this);
}

Cat.prototype.draw = function (ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

/*************
 * Main Code *
 *************/

var AM = new AssetManager();

AM.queueDownload("./img/cat.png");
AM.queueDownload("./img/zelda.png");
AM.queueDownload("./img/background.jpg");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/background.jpg")));
    gameEngine.addEntity(new Cat(gameEngine, AM.getAsset("./img/cat.png")));
    gameEngine.addEntity(new Zelda(gameEngine, AM.getAsset("./img/zelda.png")));

    console.log("All Done!");
});