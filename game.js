let playerHealth = 100;
let enemyHealth = 100;

let playerPower = 0;
let enemyPower = 0;

let playerX = 20;
let enemyX = 70;

let timeLeft = 60;
let gameRunning = true;
let blocking = false;

const player = document.getElementById("player");
const enemy = document.getElementById("enemy");

const playerHealthBar = document.getElementById("playerHealth");
const enemyHealthBar = document.getElementById("enemyHealth");

const playerPowerBar = document.getElementById("playerPower");
const enemyPowerBar = document.getElementById("enemyPower");

const timer = document.getElementById("timer");
const message = document.getElementById("message");
const gameOver = document.getElementById("gameOver");
const resultText = document.getElementById("resultText");

function updateScreen() {
  player.style.left = playerX + "%";
  enemy.style.left = enemyX + "%";

  playerHealthBar.style.width = playerHealth + "%";
  enemyHealthBar.style.width = enemyHealth + "%";

  playerPowerBar.style.width = playerPower + "%";
  enemyPowerBar.style.width = enemyPower + "%";

  timer.textContent = timeLeft;
}

function showMessage(text) {
  message.textContent = text;

  setTimeout(() => {
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

  if (playerX > 88) {
    playerX = 88;
  }

  updateScreen();
}

function punch() {
  if (!gameRunning) return;

  if (distance() < 22) {
    let damage = 8;

    if (blocking) {
      damage = 3;
    }

    enemyHealth -= damage;
    playerPower += 8;

    showMessage("PUNCH!");

    if (enemyHealth < 0) {
      enemyHealth = 0;
    }

    if (playerPower > 100) {
      playerPower = 100;
    }

    updateScreen();

    checkWinner();
  }
}

function kick() {
  if (!gameRunning) return;

  if (distance() < 25) {
    let damage = 12;

    if (blocking) {
      damage = 4;
    }

    enemyHealth -= damage;
    playerPower += 12;

    showMessage("KICK!");

    if (enemyHealth < 0) {
      enemyHealth = 0;
    }

    if (playerPower > 100) {
      playerPower = 100;
    }

    updateScreen();

    checkWinner();
  }
}

function block() {
  if (!gameRunning) return;

  blocking = true;
  showMessage("BLOCK!");

  setTimeout(() => {
    blocking = false;
  }, 700);
}

function special() {
  if (!gameRunning) return;

  if (playerPower < 100) {
    showMessage("POWER NOT READY!");
    return;
  }

  if (distance() < 35) {
    enemyHealth -= 35;
    playerPower = 0;

    showMessage("⚡ SPECIAL ATTACK!");

    if (enemyHealth < 0) {
      enemyHealth = 0;
    }

    updateScreen();

    checkWinner();
  } else {
    showMessage("TOO FAR!");
  }
}

function enemyAI() {
  if (!gameRunning) return;

  const d = distance();

  if (d > 25) {
    if (enemyX > playerX) {
      enemyX -= 2;
    } else {
      enemyX += 2;
    }
  } else {
    const attackChance = Math.random();

    if (attackChance > 0.55) {
      enemyAttack();
    }
  }

  updateScreen();
}

function enemyAttack() {
  if (!gameRunning) return;

  let damage = Math.floor(Math.random() * 8) + 5;

  if (blocking) {
    damage = 2;
  }

  playerHealth -= damage;
  enemyPower += 8;

  if (playerHealth < 0) {
    playerHealth = 0;
  }

  if (enemyPower > 100) {
    enemyPower = 100;
  }

  updateScreen();

  checkWinner();
}

function checkWinner() {
  if (enemyHealth <= 0) {
    endGame("YOU WIN!");
  }

  if (playerHealth <= 0) {
    endGame("YOU LOSE!");
  }
}

function endGame(result) {
  gameRunning = false;

  resultText.textContent = result;
  gameOver.classList.remove("hidden");
  message.textContent = "";
}

function restartGame() {
  playerHealth = 100;
  enemyHealth = 100;

  playerPower = 0;
  enemyPower = 0;

  playerX = 20;
  enemyX = 70;

  timeLeft = 60;
  gameRunning = true;
  blocking = false;

  gameOver.classList.add("hidden");
  message.textContent = "FIGHT!";

  updateScreen();

  setTimeout(() => {
    if (gameRunning) {
      message.textContent = "";
    }
  }, 1000);
}

function gameTimer() {
  if (!gameRunning) return;

  timeLeft--;

  if (timeLeft <= 0) {
    if (playerHealth > enemyHealth) {
      endGame("TIME! YOU WIN!");
    } else if (enemyHealth > playerHealth) {
      endGame("TIME! YOU LOSE!");
    } else {
      endGame("DRAW!");
    }

    return;
  }

  updateScreen();
}

updateScreen();

setInterval(enemyAI, 900);
setInterval(gameTimer, 1000);
