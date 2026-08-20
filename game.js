let playerHP = 100;
let enemyHP = 100;

let playerX = 20;
let enemyX = 72;

let playerY = 0;
let velocityY = 0;

let playerBlocking = false;
let gameRunning = true;

let facingRight = true;

const player = document.getElementById("player");
const enemy = document.getElementById("enemy");

const playerHPBar = document.getElementById("player-hp");
const enemyHPBar = document.getElementById("enemy-hp");

const timerElement = document.getElementById("timer");
const message = document.getElementById("message");

const gameOver = document.getElementById("game-over");
const result = document.getElementById("result");

const joystick = document.getElementById("joystick");
const knob = document.getElementById("joystick-knob");

let joystickActive = false;
let joystickX = 0;


/* SCREEN */

function updateScreen() {

  player.style.left = playerX + "%";

  player.style.bottom =
    "calc(20% + " + playerY + "px)";

  enemy.style.left = enemyX + "%";

  playerHPBar.style.width =
    playerHP + "%";

  enemyHPBar.style.width =
    enemyHP + "%";

  if (facingRight) {
    player.style.transform = "scaleX(1)";
  } else {
    player.style.transform = "scaleX(-1)";
  }
}


/* MESSAGE */

function showMessage(text) {

  message.textContent = text;

  setTimeout(function () {

    if (gameRunning) {
      message.textContent = "";
    }

  }, 500);
}


/* DISTANCE */

function distance() {

  return Math.abs(playerX - enemyX);
}


/* JOYSTICK */

function handleJoystick(clientX) {

  const rect =
    joystick.getBoundingClientRect();

  const centerX =
    rect.left + rect.width / 2;

  let difference =
    clientX - centerX;

  const maximum =
    rect.width / 2 - 25;

  if (difference > maximum) {
    difference = maximum;
  }

  if (difference < -maximum) {
    difference = -maximum;
  }

  joystickX =
    difference / maximum;

  knob.style.transform =
    "translate(calc(-50% + " +
    difference +
    "px), -50%)";
}


joystick.addEventListener(
  "pointerdown",
  function(event) {

    joystickActive = true;

    joystick.setPointerCapture(
      event.pointerId
    );

    handleJoystick(event.clientX);
  }
);


joystick.addEventListener(
  "pointermove",
  function(event) {

    if (!joystickActive) return;

    handleJoystick(event.clientX);
  }
);


joystick.addEventListener(
  "pointerup",
  function() {

    joystickActive = false;

    joystickX = 0;

    knob.style.transform =
      "translate(-50%, -50%)";
  }
);


joystick.addEventListener(
  "pointercancel",
  function() {

    joystickActive = false;

    joystickX = 0;

    knob.style.transform =
      "translate(-50%, -50%)";
  }
);



/* MOVEMENT */

setInterval(function () {

  if (!gameRunning) return;

  const speed = 1.5;

  if (joystickX < -0.15) {
    playerX -= speed;
    facingRight = false;
  }

  if (joystickX > 0.15) {
    playerX += speed;
    facingRight = true;
  }

  /* ARENA BOUNDARIES */

  if (playerX < 2) {
    playerX = 2;
  }

  if (playerX > 92) {
    playerX = 92;
  }

  /* APPLY POSITION */

  player.style.left = playerX + "%";

  if (facingRight) {
    player.style.transform = "scaleX(1)";
  } else {
    player.style.transform = "scaleX(-1)";
  }

}, 30);


/* JUMP */

function jump() {

  if (!gameRunning) return;

  if (playerY !== 0) return;

  velocityY = 13;

  showMessage("JUMP!");
}


setInterval(function() {

  if (!gameRunning) return;

  if (playerY > 0 || velocityY > 0) {

    playerY += velocityY;

    velocityY -= 0.8;

    if (playerY <= 0) {

      playerY = 0;
      velocityY = 0;
    }

    updateScreen();
  }

}, 30);


/* DASH */

function dash() {

  if (!gameRunning) return;

  if (facingRight) {
    playerX += 10;
  } else {
    playerX -= 10;
  }

  if (playerX < 2) {
    playerX = 2;
  }

  if (playerX > 92) {
    playerX = 92;
  }

  showMessage("DASH!");

  updateScreen();
}


/* PUNCH */

function punch() {function kick() {
  if (!gameRunning) return;

  if (distance() > 30) {
    showMessage("TOO FAR!");
    return;
  }

  enemyHP -= 12;

  if (enemyHP < 0) {
    enemyHP = 0;
  }

  showMessage("KICK!");

  updateScreen();
  checkWinner();
}

  if (!gameRunning) return;

  if (distance() > 25) {

    showMessage("TOO FAR!");

    return;
  }

  enemyHP -= 8;

  if (enemyHP < 0) {
    enemyHP = 0;
  }

  showMessage("PUNCH!");

  updateScreen();

  checkWinner();
}


/* KICK */

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

  showMessage("KICK!");

  updateScreen();

  checkWinner();
}


/* BLOCK */

function block() {

  if (!gameRunning) return;

  playerBlocking = true;

  showMessage("BLOCK!");

  setTimeout(function() {

    playerBlocking = false;

  }, 800);
}


/* SPECIAL */

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

  showMessage("SPECIAL!");

  updateScreen();

  checkWinner();
}


/* ENEMY */

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

  showMessage("ROCCO ATTACK!");

  updateScreen();

  checkWinner();
}


/* WIN / LOSE */

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

  gameOver.classList.remove(
    "hidden"
  );
}


/* RESTART */

function restartGame() {

  playerHP = 100;
  enemyHP = 100;

  playerX = 20;
  enemyX = 72;

  playerY = 0;
  velocityY = 0;

  playerBlocking = false;
  gameRunning = true;

  timeLeft = 60;

  gameOver.classList.add(
    "hidden"
  );

  message.textContent =
    "FIGHT!";

  updateScreen();

  setTimeout(function() {

    message.textContent = "";

  }, 800);
}


/* TIMER */

let timeLeft = 60;

setInterval(function() {

  if (!gameRunning) return;

  timeLeft--;

  timerElement.textContent =
    timeLeft;

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


/* ENEMY AI */

setInterval(function() {

  enemyAttack();

}, 1500);


/* BUTTONS */

document.getElementById("jump")
  .addEventListener(
    "click",
    jump
  );

document.getElementById("dash")
  .addEventListener(
    "click",
    dash
  );

document.getElementById("punch")
  .addEventListener(
    "click",
    punch
  );

document.getElementById("kick")
  .addEventListener(
    "click",
    kick
  );

document.getElementById("block")
  .addEventListener(
    "click",
    block
  );

document.getElementById("special")
  .addEventListener(
    "click",
    special
  );

document.getElementById("restart")
  .addEventListener(
    "click",
    restartGame
);


/* START */

updateScreen();
