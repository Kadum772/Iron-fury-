/* =========================================================
   IRON FURY
   COMPLETE GAME ENGINE
   ========================================================= */

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

/* ================= BUTTONS ================= */

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

/* ================= SETTINGS ================= */

const MAX_HEALTH = 100;

const ARENA_MIN = 5;
const ARENA_MAX = 90;

const PLAYER_SPEED = 0.055;
const ENEMY_SPEED = 0.035;

const GRAVITY = 0.0008;
const JUMP_POWER = 0.55;

/* ================= GAME STATE ================= */

let playerHealth = MAX_HEALTH;
let enemyHealth = MAX_HEALTH;

let playerX = 24;
let enemyX = 70;

let playerY = 0;
let enemyY = 0;

let playerVelocityY = 0;
let enemyVelocityY = 0;

let playerFacing = 1;
let enemyFacing = -1;

let gameOver = false;

let playerBlocking = false;
let enemyBlocking = false;

let playerAttacking = false;
let enemyAttacking = false;

let playerAttackCooldown = false;
let enemyAttackCooldown = false;

let dashCooldown = false;

let joystickActive = false;
let joystickX = 0;
let joystickY = 0;

let timeLeft = 60;

let lastFrame = 0;
let enemyThinkTimer = 0;
let timerInterval;

/* =========================================================
   BASIC HELPERS
   ========================================================= */

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function fighterDistance() {
  return Math.abs(playerX - enemyX);
}

/* =========================================================
   POSITION
   ========================================================= */

function updatePositions() {

  player.style.left =
    playerX + "%";

  enemy.style.left =
    enemyX + "%";

  player.style.bottom =
    "calc(27% + " + playerY + "px)";

  enemy.style.bottom =
    "calc(27% + " + enemyY + "px)";
}

/* =========================================================
   FACING
   ========================================================= */

function updateFacing() {

  if (playerX < enemyX) {
    playerFacing = 1;
    enemyFacing = -1;
  } else {
    playerFacing = -1;
    enemyFacing = 1;
  }

  player.style.transform =
    `scaleX(${playerFacing})`;

  enemy.style.transform =
    `scaleX(${enemyFacing})`;
}

/* =========================================================
   HEALTH
   ========================================================= */

function updateHealth() {

  playerHealth =
    clamp(playerHealth, 0, MAX_HEALTH);

  enemyHealth =
    clamp(enemyHealth, 0, MAX_HEALTH);

  playerHealthBar.style.width =
    playerHealth + "%";

  enemyHealthBar.style.width =
    enemyHealth + "%";
}

/* =========================================================
   DAMAGE
   ========================================================= */

function damageEnemy(amount) {

  if (gameOver) return;

  if (enemyBlocking) {
    amount *= 0.25;
  }

  enemyHealth -= amount;

  enemy.classList.add("hit");

  setTimeout(() => {
    enemy.classList.remove("hit");
  }, 180);

  updateHealth();

  if (enemyHealth <= 0) {
    finishRound("PLAYER WINS");
  }
}

function damagePlayer(amount) {

  if (gameOver) return;

  if (playerBlocking) {
    amount *= 0.25;
  }

  playerHealth -= amount;

  player.classList.add("hit");

  setTimeout(() => {
    player.classList.remove("hit");
  }, 180);

  updateHealth();

  if (playerHealth <= 0) {
    finishRound("ENEMY WINS");
  }
}

/* =========================================================
   PLAYER MOVEMENT
   ========================================================= */

function movePlayer(amount) {

  if (gameOver) return;

  if (playerAttacking) return;

  playerX += amount;

  playerX =
    clamp(
      playerX,
      ARENA_MIN,
      ARENA_MAX
    );

  if (Math.abs(amount) > 0.001) {
    player.classList.add("walking");
  } else {
    player.classList.remove("walking");
  }

  updatePositions();
  updateFacing();
}

/* =========================================================
   JOYSTICK
   ========================================================= */

function resetJoystick() {

  joystickActive = false;

  joystickX = 0;
  joystickY = 0;

  joystickKnob.style.transform =
    "translate(-50%, -50%)";

  player.classList.remove("walking");
}

function handleJoystick(x, y) {

  const rect =
    joystick.getBoundingClientRect();

  const centerX =
    rect.left + rect.width / 2;

  const centerY =
    rect.top + rect.height / 2;

  let dx = x - centerX;
  let dy = y - centerY;

  const radius =
    rect.width / 2 - 25;

  const distance =
    Math.sqrt(
      dx * dx +
      dy * dy
    );

  if (distance > radius) {

    dx =
      dx / distance * radius;

    dy =
      dy / distance * radius;
  }

  joystickX =
    dx / radius;

  joystickY =
    dy / radius;

  joystickKnob.style.transform =
    `translate(
      calc(-50% + ${dx}px),
      calc(-50% + ${dy}px)
    )`;
}

joystick.addEventListener(
  "pointerdown",
  event => {

    joystickActive = true;

    joystick.setPointerCapture(
      event.pointerId
    );

    handleJoystick(
      event.clientX,
      event.clientY
    );
  }
);

joystick.addEventListener(
  "pointermove",
  event => {

    if (!joystickActive) return;

    handleJoystick(
      event.clientX,
      event.clientY
    );
  }
);

joystick.addEventListener(
  "pointerup",
  resetJoystick
);

joystick.addEventListener(
  "pointercancel",
  resetJoystick
);

/* =========================================================
   JUMP
   ========================================================= */

function jump() {

  if (gameOver) return;

  if (playerY > 2) return;

  playerVelocityY =
    JUMP_POWER;
}

jumpButton.addEventListener(
  "pointerdown",
  jump
);

/* =========================================================
   DASH
   ========================================================= */

function dash() {

  if (gameOver) return;

  if (dashCooldown) return;

  dashCooldown = true;

  player.classList.add("dashing");

  playerX +=
    playerFacing * 8;

  playerX =
    clamp(
      playerX,
      ARENA_MIN,
      ARENA_MAX
    );

  updatePositions();

  setTimeout(() => {

    player.classList.remove(
      "dashing"
    );

  }, 180);

  setTimeout(() => {

    dashCooldown = false;

  }, 650);
}

dashButton.addEventListener(
  "pointerdown",
  dash
);

/* =========================================================
   PUNCH
   ========================================================= */

function punch() {

  if (gameOver) return;

  if (playerAttackCooldown) return;

  playerAttackCooldown = true;
  playerAttacking = true;

  player.classList.remove(
    "walking"
  );

  player.classList.add(
    "punching"
  );

  setTimeout(() => {

    if (fighterDistance() < 15) {
      damageEnemy(10);
    }

  }, 100);

  setTimeout(() => {

    player.classList.remove(
      "punching"
    );

    playerAttacking = false;

  }, 250);

  setTimeout(() => {

    playerAttackCooldown = false;

  }, 350);
}

punchButton.addEventListener(
  "pointerdown",
  punch
);

/* =========================================================
   KICK
   ========================================================= */

function kick() {

  if (gameOver) return;

  if (playerAttackCooldown) return;

  playerAttackCooldown = true;
  playerAttacking = true;

  player.classList.add(
    "kicking"
  );

  setTimeout(() => {

    if (fighterDistance() < 18) {
      damageEnemy(14);
    }

  }, 120);

  setTimeout(() => {

    player.classList.remove(
      "kicking"
    );

    playerAttacking = false;

  }, 300);

  setTimeout(() => {

    playerAttackCooldown = false;

  }, 450);
}

kickButton.addEventListener(
  "pointerdown",
  kick
);

/* =========================================================
   BLOCK
   ========================================================= */

function startBlock() {

  if (gameOver) return;

  playerBlocking = true;

  player.classList.add(
    "blocking"
  );
}

function stopBlock() {

  playerBlocking = false;

  player.classList.remove(
    "blocking"
  );
}

blockButton.addEventListener(
  "pointerdown",
  startBlock
);

blockButton.addEventListener(
  "pointerup",
  stopBlock
);

blockButton.addEventListener(
  "pointercancel",
  stopBlock
);

/* =========================================================
   SPECIAL
   ========================================================= */

function special() {

  if (gameOver) return;

  if (playerAttackCooldown) return;

  playerAttackCooldown = true;
  playerAttacking = true;

  message.textContent =
    "POWER!";

  player.classList.add(
    "punching"
  );

  setTimeout(() => {

    if (fighterDistance() < 22) {
      damageEnemy(25);
    }

  }, 150);

  setTimeout(() => {

    player.classList.remove(
      "punching"
    );

    playerAttacking = false;

    if (!gameOver) {
      message.textContent = "";
    }

  }, 500);

  setTimeout(() => {

    playerAttackCooldown = false;

  }, 900);
}

specialButton.addEventListener(
  "pointerdown",
  special
);

/* =========================================================
   ENEMY AI
   ========================================================= */

function enemyAI(delta) {

  if (gameOver) return;

  const distance =
    fighterDistance();

  enemyThinkTimer -= delta;

  /* Approach player */

  if (
    distance > 13 &&
    !enemyAttacking &&
    !enemyBlocking
  ) {

    const direction =
      playerX > enemyX
        ? 1
        : -1;

    enemyX +=
      direction *
      ENEMY_SPEED *
      delta;

    enemyX =
      clamp(
        enemyX,
        ARENA_MIN,
        ARENA_MAX
      );

    enemy.classList.add(
      "walking"
    );

  } else {

    enemy.classList.remove(
      "walking"
    );
  }

  /* Decision */

  if (enemyThinkTimer <= 0) {

    enemyThinkTimer =
      400 +
      Math.random() * 600;

    if (distance < 16) {

      const choice =
        Math.random();

      if (
        choice < .65 &&
        !enemyAttackCooldown
      ) {

        enemyPunch();

      } else if (
        choice < .85
      ) {

        enemyBlock();

      } else {

        enemyBlocking = false;

        enemy.classList.remove(
          "blocking"
        );
      }
    }
  }

  updatePositions();
  updateFacing();
}

/* =========================================================
   ENEMY PUNCH
   ========================================================= */

function enemyPunch() {

  if (gameOver) return;

  if (enemyAttackCooldown) return;

  enemyAttackCooldown = true;
  enemyAttacking = true;

  enemyBlocking = false;

  enemy.classList.remove(
    "walking"
  );

  enemy.classList.add(
    "punching"
  );

  setTimeout(() => {

    if (fighterDistance() < 16) {
      damagePlayer(8);
    }

  }, 100);

  setTimeout(() => {

    enemy.classList.remove(
      "punching"
    );

    enemyAttacking = false;

  }, 250);

  setTimeout(() => {

    enemyAttackCooldown = false;

  }, 600);
}

/* =========================================================
   ENEMY BLOCK
   ========================================================= */

function enemyBlock() {

  if (gameOver) return;

  enemyBlocking = true;

  enemy.classList.add(
    "blocking"
  );

  setTimeout(() => {

    enemyBlocking = false;

    enemy.classList.remove(
      "blocking"
    );

  }, 500 + Math.random() * 500);
}

/* =========================================================
   PHYSICS
   ========================================================= */

function physics(delta) {

  /* Player */

  playerVelocityY -=
    GRAVITY * delta;

  playerY +=
    playerVelocityY * delta;

  if (playerY <= 0) {

    playerY = 0;

    playerVelocityY = 0;
  }

  /* Enemy */

  enemyVelocityY -=
    GRAVITY * delta;

  enemyY +=
    enemyVelocityY * delta;

  if (enemyY <= 0) {

    enemyY = 0;

    enemyVelocityY = 0;
  }

  updatePositions();
}

/* =========================================================
   TIMER
   ========================================================= */

function startTimer() {

  clearInterval(timerInterval);

  timerInterval =
    setInterval(() => {

      if (gameOver) return;

      timeLeft--;

      timerElement.textContent =
        timeLeft;

      if (timeLeft <= 0) {

        if (
          playerHealth >
          enemyHealth
        ) {

          finishRound(
            "PLAYER WINS"
          );

        } else if (
          enemyHealth >
          playerHealth
        ) {

          finishRound(
            "ENEMY WINS"
          );

        } else {

          finishRound(
            "DRAW"
          );
        }
      }

    }, 1000);
}

/* =========================================================
   END ROUND
   ========================================================= */

function finishRound(result) {

  if (gameOver) return;

  gameOver = true;

  clearInterval(
    timerInterval
  );

  player.classList.remove(
    "walking"
  );

  enemy.classList.remove(
    "walking"
  );

  message.textContent =
    result;

  setTimeout(() => {

    message.textContent =
      "ROUND RESTART";

  }, 1600);

  setTimeout(() => {

    restartRound();

  }, 2400);
}

/* =========================================================
   RESTART
   ========================================================= */

function restartRound() {

  playerHealth =
    MAX_HEALTH;

  enemyHealth =
    MAX_HEALTH;

  playerX = 24;
  enemyX = 70;

  playerY = 0;
  enemyY = 0;

  playerVelocityY = 0;
  enemyVelocityY = 0;

  playerFacing = 1;
  enemyFacing = -1;

  playerBlocking = false;
  enemyBlocking = false;

  playerAttacking = false;
  enemyAttacking = false;

  playerAttackCooldown = false;
  enemyAttackCooldown = false;

  dashCooldown = false;

  timeLeft = 60;

  gameOver = false;

  message.textContent = "";

  timerElement.textContent =
    "60";

  player.className =
    "fighter player";

  enemy.className =
    "fighter enemy";

  updateHealth();
  updatePositions();
  updateFacing();

  startTimer();
}

/* =========================================================
   GAME LOOP
   ========================================================= */

function gameLoop(timestamp) {

  if (!lastFrame) {
    lastFrame = timestamp;
  }

  const delta =
    timestamp - lastFrame;

  lastFrame = timestamp;

  if (!gameOver) {

    if (
      joystickActive &&
      Math.abs(joystickX) > .08
    ) {

      movePlayer(
        joystickX *
        PLAYER_SPEED *
        delta
      );
    }

    physics(delta);

    enemyAI(delta);
  }

  requestAnimationFrame(
    gameLoop
  );
}

/* =========================================================
   START
   ========================================================= */

function startGame() {

  updateHealth();

  updatePositions();

  updateFacing();

  startTimer();

  requestAnimationFrame(
    gameLoop
  );
}

startGame();
