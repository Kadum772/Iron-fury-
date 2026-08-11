let playerHP = 100;
let enemyHP = 100;

let playerX = 20;
let enemyX = 72;

let playerBlocking = false;
let gameRunning = true;

const player = document.getElementById("player");
const enemy = document.getElementById("enemy");

const playerHPBar = document.getElementById("player-hp");
const enemyHPBar = document.getElementById("enemy-hp");

const timerElement = document.getElementById("timer");
const message = document.getElementById("message");

const gameOver = document.getElementById("game-over");
const result = document.getElementById("result");


function updateScreen() {

  player.style.left = playerX + "%";
  enemy.style.left = enemyX + "%";

  playerHPBar.style.width = playerHP + "%";
  enemyHPBar.style.width = enemyHP + "%";
}


function showMessage(text) {

  message.textContent = text;

  setTimeout(function () {

    if (gameRunning) {
      message.textContent = "";
    }

  }, 500);
}


function distance() {

  return Math.abs(playerX - enemyX);
}


function moveLeft() {

  if (!gameRunning) return;

  playerX -= 4;

  if (playerX < 2) {
    playerX = 2;
  }

  updateScreen();
}


function moveRight() {

  if (!gameRunning) return;

  playerX += 4;

  if (playerX > 90) {
    playerX = 90;
  }

  updateScreen();
}


function punch() {

  if (!gameRunning) return;

  if (distance() > 25) {
    showMessage("TOO FAR!");
    return;
  }

  enemyHP -= 8;

  if (enemyHP < 0) {
    enemyHP = 0;
  }

  player.classList.add("attack-punch");

  setTimeout(function () {
    player.classList.remove("attack-punch");
  }, 150);

  showMessage("PUNCH!");

  updateScreen();

  checkWinner();
}


function kick() {

  if (!gameRunning) return;

  if (distance() > 30) {
    showMessage("TOO FAR!");
    return;
  }

  enemyHP -= 12;

  if (enemyHP < 0) {
    enemyHP = 0;
  }

  player.classList.add("attack-kick");

  setTimeout(function () {
    player.classList.remove("attack-kick");
  }, 250);

  showMessage("KICK!");

  updateScreen();

  checkWinner();
}


function block() {

  if (!gameRunning) return;

  playerBlocking = true;

  player.classList.add("blocking");

  showMessage("BLOCK!");

  setTimeout(function () {

    playerBlocking = false;
    player.classList.remove("blocking");

  }, 800);
}


function enemyAttack() {

  if (!gameRunning) return;

  if (distance() > 28) {

    if (enemyX > playerX) {
      enemyX -= 2;
    } else {
      enemyX += 2;
    }

    updateScreen();

    return;
  }

  let damage = 7;

  if (playerBlocking) {
    damage = 2;
  }

  playerHP -= damage;

  if (playerHP < 0) {
    playerHP = 0;
  }

  enemy.classList.add("attack-punch");

  setTimeout(function () {
    enemy.classList.remove("attack-punch");
  }, 150);

  showMessage("ROCCO ATTACK!");

  updateScreen();

  checkWinner();
}


function special() {

  if (!gameRunning) return;

  if (distance() > 35) {
    showMessage("TOO FAR!");
    return;
  }

  enemyHP -= 25;

  if (enemyHP < 0) {
    enemyHP = 0;
  }

  player.classList.add("attack-kick");

  setTimeout(function () {
    player.classList.remove("attack-kick");
  }, 300);

  showMessage("SPECIAL!");

  updateScreen();

  checkWinner();
}


function checkWinner() {

  if (enemyHP <= 0) {

    endGame("YOU WIN!");

    return;
  }

  if (playerHP <= 0) {

    endGame("YOU LOSE!");
  }
}


function endGame(text) {

  gameRunning = false;

  result.textContent = text;

  gameOver.classList.remove("hidden");
}


function restartGame() {

  playerHP = 100;
  enemyHP = 100;

  playerX = 20;
  enemyX = 72;

  playerBlocking = false;
  gameRunning = true;

  gameOver.classList.add("hidden");

  message.textContent = "FIGHT!";

  updateScreen();

  setTimeout(function () {
    message.textContent = "";
  }, 800);
}


let timeLeft = 60;

setInterval(function () {

  if (!gameRunning) return;

  timeLeft--;

  timerElement.textContent = timeLeft;

  if (timeLeft <= 0) {

    if (playerHP > enemyHP) {
      endGame("YOU WIN!");
    }

    else if (enemyHP > playerHP) {
      endGame("YOU LOSE!");
    }

    else {
      endGame("DRAW!");
    }
  }

}, 1000);


setInterval(function () {

  enemyAttack();

}, 1500);


document.getElementById("left").addEventListener(
  "click",
  moveLeft
);

document.getElementById("right").addEventListener(
  "click",
  moveRight
);

document.getElementById("punch").addEventListener(
  "click",
  punch
);

document.getElementById("kick").addEventListener(
  "click",
  kick
);

document.getElementById("block").addEventListener(
  "click",
  block
);

document.getElementById("special").addEventListener(
  "click",
  special
);

document.getElementById("restart").addEventListener(
  "click",
  restartGame
);


updateScreen();
