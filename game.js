const player = document.getElementById("player");
const enemy = document.getElementById("enemy");

const playerHealthBar =
  document.getElementById("player-health");

const enemyHealthBar =
  document.getElementById("enemy-health");

const timerElement =
  document.getElementById("timer");

const message =
  document.getElementById("message");

const joystick =
  document.getElementById("joystick");

const joystickKnob =
  document.getElementById("joystick-knob");

const jumpButton =
  document.getElementById("jump");

const dashButton =
  document.getElementById("dash");

const punchButton =
  document.getElementById("punch");

const kickButton =
  document.getElementById("kick");

const blockButton =
  document.getElementById("block");

const specialButton =
  document.getElementById("special");


/* =========================
   GAME VARIABLES
========================= */

let playerX = 18;
let enemyX = 72;

let playerHP = 100;
let enemyHP = 100;

let joystickX = 0;
let joystickY = 0;

let blocking = false;
let gameRunning = true;

let facingRight = true;


/* =========================
   POSITION
========================= */

function updatePositions() {

  player.style.left = playerX + "%";
  enemy.style.left = enemyX + "%";

  if (facingRight) {
    player.style.transform = "scaleX(1)";
  } else {
    player.style.transform = "scaleX(-1)";
  }
}


/* =========================
   DISTANCE
========================= */

function getDistance() {
  return Math.abs(playerX - enemyX);
}


/* =========================
   MESSAGE
========================= */

function showMessage(text) {

  message.textContent = text;

  setTimeout(() => {
    message.textContent = "";
  }, 500);
}


/* =========================
   HEALTH
========================= */

function updateHealth() {

  playerHealthBar.style.width =
    playerHP + "%";

  enemyHealthBar.style.width =
    enemyHP + "%";
}


/* =========================
   PLAYER MOVEMENT
========================= */

function movePlayer() {

  if (!gameRunning) return;

  const speed = 0.7;

  if (joystickX < -0.2) {

    playerX -= speed;
    facingRight = false;

  } else if (joystickX > 0.2) {

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

  /* WALK ANIMATION */

  if (Math.abs(joystickX) > 0.2) {
    player.classList.add("walking");
  } else {
    player.classList.remove("walking");
  }

  updatePositions();
}


/* =========================
   GAME LOOP
========================= */

setInterval(movePlayer, 30);


/* =========================
   JOYSTICK
========================= */

let joystickActive = false;

function handleJoystick(event) {

  if (!joystickActive) return;

  const rect =
    joystick.getBoundingClientRect();

  const point =
    event.touches
      ? event.touches[0]
      : event;

  let dx =
    point.clientX -
    (rect.left + rect.width / 2);

  let dy =
    point.clientY -
    (rect.top + rect.height / 2);

  const maxDistance =
    rect.width / 2 - 25;

  const distance =
    Math.sqrt(dx * dx + dy * dy);

  if (distance > maxDistance) {

    dx =
      dx / distance *
      maxDistance;

    dy =
      dy / distance *
      maxDistance;
  }

  joystickKnob.style.transform =
    `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;

  joystickX =
    dx / maxDistance;

  joystickY =
    dy / maxDistance;
}


joystick.addEventListener(
  "touchstart",
  (event) => {

    joystickActive = true;

    handleJoystick(event);

  },
  { passive: false }
);


joystick.addEventListener(
  "touchmove",
  (event) => {

    event.preventDefault();

    handleJoystick(event);

  },
  { passive: false }
);


joystick.addEventListener(
  "touchend",
  () => {

    joystickActive = false;

    joystickX = 0;
    joystickY = 0;

    joystickKnob.style.transform =
      "translate(-50%, -50%)";

  }
);


/* =========================
   PUNCH
========================= */

function punch() {

  if (!gameRunning) return;

  player.classList.add("punching");

  setTimeout(() => {
    player.classList.remove("punching");
  }, 180);

  if (getDistance() < 16) {

    enemyHP -= 10;

    if (enemyHP < 0) {
      enemyHP = 0;
    }

    updateHealth();

    showMessage("HIT!");
  }
}

punchButton.addEventListener(
  "click",
  punch
);


/* =========================
   KICK
========================= */

function kick() {

  if (!gameRunning) return;

  player.classList.add("kicking");

  setTimeout(() => {
    player.classList.remove("kicking");
  }, 250);

  if (getDistance() < 18) {

    enemyHP -= 15;

    if (enemyHP < 0) {
      enemyHP = 0;
    }

    updateHealth();

    showMessage("KICK!");
  }
}

kickButton.addEventListener(
  "click",
  kick
);


/* =========================
   BLOCK
========================= */

function startBlock() {

  blocking = true;

  player.classList.add("blocking");
}

function stopBlock() {

  blocking = false;

  player.classList.remove("blocking");
}

blockButton.addEventListener(
  "touchstart",
  startBlock
);

blockButton.addEventListener(
  "touchend",
  stopBlock
);

blockButton.addEventListener(
  "mousedown",
  startBlock
);

blockButton.addEventListener(
  "mouseup",
  stopBlock
);


/* =========================
   JUMP
========================= */

function jump() {

  if (!gameRunning) return;

  player.style.bottom = "45%";

  setTimeout(() => {

    player.style.bottom = "27%";

  }, 350);
}

jumpButton.addEventListener(
  "click",
  jump
);


/* =========================
   DASH
========================= */

function dash() {

  if (!gameRunning) return;

  player.classList.add("dashing");

  if (facingRight) {
    playerX += 7;
  } else {
    playerX -= 7;
  }

  if (playerX < 2) playerX = 2;
  if (playerX > 92) playerX = 92;

  updatePositions();

  setTimeout(() => {

    player.classList.remove("dashing");

  }, 180);
}

dashButton.addEventListener(
  "click",
  dash
);


/* =========================
   SPECIAL
========================= */

function special() {

  if (!gameRunning) return;

  if (getDistance() < 20) {

    enemyHP -= 25;

    if (enemyHP < 0) {
      enemyHP = 0;
    }

    updateHealth();

    showMessage("SPECIAL!");

  } else {

    showMessage("TOO FAR!");
  }
}

specialButton.addEventListener(
  "click",
  special
);


/* =========================
   ENEMY
========================= */

setInterval(() => {

  if (!gameRunning) return;

  const distance =
    getDistance();

  if (distance > 20) {

    if (enemyX > playerX) {
      enemyX -= 0.25;
    } else {
      enemyX += 0.25;
    }

  } else {

    if (Math.random() < 0.02) {

      if (!blocking) {

        playerHP -= 5;

        if (playerHP < 0) {
          playerHP = 0;
        }

        updateHealth();

        showMessage("ENEMY HIT!");
      }
    }
  }

  updatePositions();

}, 40);


/* =========================
   INITIALIZE
========================= */

updatePositions();
updateHealth();
