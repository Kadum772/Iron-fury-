/* =====================================
   IRON FURY
   Mobile Fighting Prototype
===================================== */


/* =========================
   GAME VARIABLES
========================= */

let playerHP = 100;
let enemyHP = 100;

let playerPower = 0;
let enemyPower = 0;

let playerX = 20;
let enemyX = 72;

let timeLeft = 60;

let gameRunning = true;

let playerBlocking = false;
let enemyBlocking = false;


/* =========================
   HTML ELEMENTS
========================= */

const player =
  document.getElementById("player");

const enemy =
  document.getElementById("enemy");

const playerHPBar =
  document.getElementById("playerHP");

const enemyHPBar =
  document.getElementById("enemyHP");

const playerPowerBar =
  document.getElementById("playerPower");

const enemyPowerBar =
  document.getElementById("enemyPower");

const timer =
  document.getElementById("timer");

const message =
  document.getElementById("message");

const gameOver =
  document.getElementById("gameOver");

const result =
  document.getElementById("result");


/* =========================
   BUTTONS
========================= */

const leftBtn =
  document.getElementById("leftBtn");

const rightBtn =
  document.getElementById("rightBtn");

const punchBtn =
  document.getElementById("punchBtn");

const kickBtn =
  document.getElementById("kickBtn");

const blockBtn =
  document.getElementById("blockBtn");

const dashBtn =
  document.getElementById("dashBtn");

const specialBtn =
  document.getElementById("specialBtn");

const restartBtn =
  document.getElementById("restartBtn");


/* =========================
   SCREEN UPDATE
========================= */

function updateScreen() {

  player.style.left =
    playerX + "%";

  enemy.style.left =
    enemyX + "%";


  playerHPBar.style.width =
    playerHP + "%";

  enemyHPBar.style.width =
    enemyHP + "%";


  playerPowerBar.style.width =
    playerPower + "%";

  enemyPowerBar.style.width =
    enemyPower + "%";


  timer.textContent =
    timeLeft;
}


/* =========================
   MESSAGE
========================= */

function showMessage(text) {

  message.textContent =
    text;

  setTimeout(() => {

    if (gameRunning) {

      message.textContent =
        "";

    }

  }, 500);
}


/* =========================
   DISTANCE
========================= */

function distance() {

  return Math.abs(
    playerX - enemyX
  );
}


/* =========================
   MOVEMENT
========================= */

function moveLeft() {

  if (!gameRunning)
    return;

  playerX -= 4;

  if (playerX < 2)
    playerX = 2;

  updateScreen();
}


function moveRight() {

  if (!gameRunning)
    return;

  playerX += 4;

  if (playerX > 90)
    playerX = 90;

  updateScreen();
}


/* =========================
   DASH
========================= */

function dash() {

  if (!gameRunning)
    return;

  if (playerX < enemyX)
    playerX += 10;

  else
    playerX -= 10;


  if (playerX < 2)
    playerX = 2;

  if (playerX > 90)
    playerX = 90;


  showMessage("DASH!");

  updateScreen();
}


/* =========================
   PLAYER PUNCH
========================= */

function punch() {

  if (!gameRunning)
    return;


  if (distance() > 23) {

    showMessage("TOO FAR!");

    return;
  }


  player.classList.add(
    "attack"
  );


  setTimeout(() => {

    player.classList.remove(
      "attack"
    );

  }, 150);


  let damage = 8;


  if (enemyBlocking)
    damage = 2;


  enemyHP -= damage;

  playerPower += 10;


  if (playerPower > 100)
    playerPower = 100;


  showMessage("PUNCH!");


  updateScreen();

  checkWinner();
}


/* =========================
   PLAYER KICK
========================= */

function kick() {

  if (!gameRunning)
    return;


  if (distance() > 28) {

    showMessage("TOO FAR!");

    return;
  }


  player.classList.add(
    "kick-animation"
  );


  setTimeout(() => {

    player.classList.remove(
      "kick-animation"
    );

  }, 200);


  let damage = 12;


  if (enemyBlocking)
    damage = 3;


  enemyHP -= damage;

  playerPower += 14;


  if (playerPower > 100)
    playerPower = 100;


  showMessage("KICK!");


  updateScreen();

  checkWinner();
}


/* =========================
   BLOCK
========================= */

function block() {

  if (!gameRunning)
    return;


  playerBlocking = true;


  player.classList.add(
    "block-animation"
  );


  showMessage("BLOCK");


  setTimeout(() => {

    playerBlocking = false;

    player.classList.remove(
      "block-animation"
    );

  }, 800);
}


/* =========================
   SPECIAL ATTACK
========================= */

function special() {

  if (!gameRunning)
    return;


  if (playerPower < 100) {

    showMessage(
      "POWER NOT READY!"
    );

    return;
  }


  if (distance() > 35) {

    showMessage(
      "TOO FAR!"
    );

    return;
  }


  playerPower = 0;


  enemyHP -= 35;


  player.classList.add(
    "attack"
  );


  setTimeout(() => {

    player.classList.remove(
      "attack"
    );

  }, 300);


  showMessage(
    "⚡ SPECIAL!"
  );


  updateScreen();

  checkWinner();
}


/* =========================
   ENEMY AI
========================= */

function enemyAI() {

  if (!gameRunning)
    return;


  let d =
    distance();


  /* MOVE TOWARD PLAYER */

  if (d > 28) {

    if (enemyX > playerX)
      enemyX -= 2;

    else
      enemyX += 2;


    updateScreen();

    return;
  }


  /* RANDOM ACTION */

  let random =
    Math.random();


  if (
    enemyPower >= 100 &&
    random < .15
  ) {

    enemySpecial();

    return;
  }


  if (random < .55) {

    enemyPunch();

  }

  else if (random < .80) {

    enemyKick();

  }

  else {

    enemyBlock();

  }
}


/* =========================
   ENEMY PUNCH
========================= */

function enemyPunch() {

  let damage = 7;


  if (playerBlocking)
    damage = 2;


  playerHP -= damage;

  enemyPower += 9;


  if (enemyPower > 100)
    enemyPower = 100;


  enemy.classList.add(
    "attack"
  );


  setTimeout(() => {

    enemy.classList.remove(
      "attack"
    );

  }, 150);


  updateScreen();

  checkWinner();
}


/* =========================
   ENEMY KICK
========================= */

function enemyKick() {

  let damage = 10;


  if (playerBlocking)
    damage = 3;


  playerHP -= damage;

  enemyPower += 12;


  if (enemyPower > 100)
    enemyPower = 100;


  enemy.classList.add(
    "kick-animation"
  );


  setTimeout(() => {

    enemy.classList.remove(
      "kick-animation"
    );

  }, 200);


  updateScreen();

  checkWinner();
}


/* =========================
   ENEMY BLOCK
========================= */

function enemyBlock() {

  enemyBlocking = true;

  showMessage(
    "ROCCO BLOCK!"
  );


  setTimeout(() => {

    enemyBlocking = false;

  }, 700);
}


/* =========================
   ENEMY SPECIAL
========================= */

function enemySpecial() {

  if (
    distance() > 35
  )
    return;


  enemyPower = 0;


  let damage = 28;


  if (playerBlocking)
    damage = 5;


  playerHP -= damage;


  showMessage(
    "ROCCO SPECIAL!"
  );


  updateScreen();

  checkWinner();
}


/* =========================
   WINNER
========================= */

function checkWinner() {

  if (enemyHP <= 0) {

    enemyHP = 0;

    endGame(
      "YOU WIN!"
    );

    return;
  }


  if (playerHP <= 0) {

    playerHP = 0;

    endGame(
      "YOU LOSE!"
    );

  }
}


/* =========================
   GAME OVER
========================= */

function endGame(text) {

  gameRunning = false;

  result.textContent =
    text;

  gameOver.classList.remove(
    "hidden"
  );

  updateScreen();
}


/* =========================
   RESTART
========================= */

function restartGame() {

  playerHP = 100;
  enemyHP = 100;

  playerPower = 0;
  enemyPower = 0;

  playerX = 20;
  enemyX = 72;

  timeLeft = 60;

  gameRunning = true;

  playerBlocking = false;
  enemyBlocking = false;


  gameOver.classList.add(
    "hidden"
  );


  message.textContent =
    "FIGHT!";


  updateScreen();


  setTimeout(() => {

    if (gameRunning)
      message.textContent = "";

  }, 1000);
}


/* =========================
   TIMER
========================= */

setInterval(() => {

  if (!gameRunning)
    return;


  timeLeft--;


  if (timeLeft <= 0) {

    timeLeft = 0;


    if (playerHP > enemyHP) {

      endGame(
        "TIME — YOU WIN!"
      );

    }

    else if (
      enemyHP > playerHP
    ) {

      endGame(
        "TIME — YOU LOSE!"
      );

    }

    else {

      endGame(
        "DRAW!"
      );

    }

    return;
  }


  updateScreen();

}, 1000);


/* =========================
   ENEMY TIMER
========================= */

setInterval(
  enemyAI,
  900
);


/* =========================
   BUTTON EVENTS
========================= */

leftBtn.addEventListener(
  "click",
  moveLeft
);

rightBtn.addEventListener(
  "click",
  moveRight
);

punchBtn.addEventListener(
  "click",
  punch
);

kickBtn.addEventListener(
  "click",
  kick
);

blockBtn.addEventListener(
  "click",
  block
);

dashBtn.addEventListener(
  "click",
  dash
);

specialBtn.addEventListener(
  "click",
  special
);

restartBtn.addEventListener(
  "click",
  restartGame
);


/* =========================
   INITIALIZE
========================= */

updateScreen();

setTimeout(() => {

  showMessage(
    "FIGHT!"
  );

}, 300);
