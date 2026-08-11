let playerX = 20;
let gameRunning = true;

const player = document.getElementById("player");

function updatePlayer() {
  player.style.left = playerX + "%";
}

function moveLeft() {
  if (!gameRunning) return;

  playerX -= 4;

  if (playerX < 2) {
    playerX = 2;
  }

  updatePlayer();
}

function moveRight() {
  if (!gameRunning) return;

  playerX += 4;

  if (playerX > 90) {
    playerX = 90;
  }

  updatePlayer();
}

// LEFT BUTTON
document.getElementById("leftBtn").addEventListener(
  "click",
  moveLeft
);

// RIGHT BUTTON
document.getElementById("rightBtn").addEventListener(
  "click",
  moveRight
);

// START POSITION
updatePlayer();
