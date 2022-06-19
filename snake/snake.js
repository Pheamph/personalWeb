const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let spd = 18;

let tile_c = 20;
let tile_s = canvas.width / tile_c;

let hx = 10;
let hy = 10;
let snakeParts = [];
let tailLength = 0;

let foodX = 7;
let foodY = 10;

let xVel = 0;
let yVel = 0;

let xv = 0;
let yv = 0;

let score = 0;

function game() {
  xv = xVel;
  yv = yVel;

  move();
  if (death())return;

  clean();
  eatFood();
  createFood();
  createSnake();

  scr();

  if (score > 5) spd = 20;
  if (score > 10) spd = 30;

  setTimeout(game, 1000/spd);
}

function death() {
  let death = false;

  if (yv === 0 && xv === 0) {
    return false;
  }

  //walls
  if (hx < 0) {
    death = true;
  } else if (hx === tile_c) {
    death = true;
  } else if (hy < 0) {
    death = true;
  } else if (hy === tile_c) {
    death = true;
  }

  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    if (part.x === hx && part.y === hy) {
      death = true;
      break;
    }
  }

  if (death) {
    ctx.fillStyle = "white";
    ctx.font = "50px Times";

    if (death) {
      ctx.fillStyle = "white";
      ctx.font = "50px Times";

      var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);

      ctx.fillText("Game Over", canvas.width / 6.5, canvas.height / 2);
    }

    ctx.fillText("Game Over", canvas.width / 6.5, canvas.height / 2);
  }

  return death;
}

function scr() {
  ctx.fillStyle = "white";
  ctx.font = "20px Times";
  ctx.fillText("Score " + score, canvas.width - 100, canvas.height-20);
}

function clean() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function createSnake() {
  ctx.fillStyle = "orange";
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    ctx.fillRect(part.x * tile_c, part.y * tile_c, tile_s, tile_s);
  }

  snakeParts.push(new SnakePart(hx, hy));
  while (snakeParts.length > tailLength) {
    snakeParts.shift();
  }

  ctx.fillStyle = "yellow";
  ctx.fillRect(hx*tile_c, hy *tile_c, tile_s, tile_s);
}

function move() {
  hx = hx + xv;
  hy = hy + yv;
}

function createFood() {
  ctx.fillStyle = "blue";
  ctx.fillRect(foodX*tile_c, foodY*tile_c, tile_s, tile_s);
}

function eatFood() {
  if (foodX === hx && foodY == hy) {
    foodX = Math.floor(Math.random() * tile_c);
    foodY = Math.floor(Math.random() * tile_c);
    tailLength++;
    score++;
  }
}

document.body.addEventListener("keydown", keyPress);

function keyPress(event) {
  if (event.keyCode == 38 || event.keyCode == 87) {
    if (yVel == 1) return;
    yVel = -1;
    xVel = 0;
  } else if (event.keyCode == 40 || event.keyCode == 83) {
    if (yVel == -1) return;
    yVel = 1;
    xVel = 0;
  } else if (event.keyCode == 37 || event.keyCode == 65) {
    if (xVel == 1) return;
    yVel = 0;
    xVel = -1;
  } else if (event.keyCode == 39 || event.keyCode == 68) {
    if (xVel == -1) return;
    yVel = 0;
    xVel = 1;
  }
}

game();
