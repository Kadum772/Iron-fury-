const player = document.getElementById("player");
const enemy = document.getElementById("enemy");

const playerHealth = document.getElementById("player-health");
const enemyHealth = document.getElementById("enemy-health");

const playerEnergy = document.getElementById("player-energy");
const enemyEnergy = document.getElementById("enemy-energy");

const timerElement = document.getElementById("timer");
const announcement = document.getElementById("announcement");

const joystick = document.getElementById("joystick");
const joystickKnob = document.getElementById("joystick-knob");

const jumpButton = document.getElementById("jump");
const dashButton = document.getElementById("dash");
const specialButton = document.getElementById("special");
const punchButton = document.getElementById("punch");
const kickButton = document.getElementById("kick");
const blockButton = document.getElementById("block");

const state = {
  running:true,
  time:60,

  player:{
    x:23,
    y:0,
    hp:100,
    energy:25,
    velocityY:0,
    attacking:false,
    blocking:false,
    cooldown:false
  },

  enemy:{
    x:68,
    y:0,
    hp:100,
    energy:25,
    velocityY:0,
    attacking:false,
    blocking:false,
    cooldown:false
  }
};

let stickX=0;
let stickY=0;
let dragging=false;
let aiClock=0;
let previousTime=performance.now();

/* =========================
   UTILITIES
========================= */

function clamp(value,min,max){
  return Math.max(min,Math.min(max,value));
}

function getDistance(){
  return Math.abs(
    state.player.x-state.enemy.x
  );
}

function setAnnouncement(text,time=0){

  announcement.textContent=text;

  if(time){

    setTimeout(()=>{

      if(state.running)
        announcement.textContent="";

    },time);

  }
}

/* =========================
   RENDER
========================= */

function render(){

  const p=state.player;
  const e=state.enemy;

  player.style.left=p.x+"%";
  enemy.style.left=e.x+"%";

  player.style.bottom=
    `calc(25% + ${p.y}px)`;

  enemy.style.bottom=
    `calc(25% + ${e.y}px)`;

  playerHealth.style.width=
    clamp(p.hp,0,100)+"%";

  enemyHealth.style.width=
    clamp(e.hp,0,100)+"%";

  playerEnergy.style.width=
    clamp(p.energy,0,100)+"%";

  enemyEnergy.style.width=
    clamp(e.energy,0,100)+"%";

  if(p.x<e.x){

    player.style.transform="scaleX(1)";
    enemy.style.transform="scaleX(-1)";

  }else{

    player.style.transform="scaleX(-1)";
    enemy.style.transform="scaleX(1)";
  }
}

/* =========================
   JOYSTICK
========================= */

function resetJoystick(){

  dragging=false;

  stickX=0;
  stickY=0;

  joystickKnob.style.left="50%";
  joystickKnob.style.top="50%";
}

function updateJoystick(x,y){

  const rect=
    joystick.getBoundingClientRect();

  const centerX=
    rect.left+rect.width/2;

  const centerY=
    rect.top+rect.height/2;

  let dx=x-centerX;
  let dy=y-centerY;

  const maximum=
    rect.width/2-27;

  const distance=
    Math.hypot(dx,dy);

  if(distance>maximum){

    dx=
      dx/distance*maximum;

    dy=
      dy/distance*maximum;
  }

  stickX=dx/maximum;
  stickY=dy/maximum;

  joystickKnob.style.left=
    `calc(50% + ${dx}px)`;

  joystickKnob.style.top=
    `calc(50% + ${dy}px)`;
}

joystick.addEventListener(
  "pointerdown",
  event=>{

    dragging=true;

    joystick.setPointerCapture(
      event.pointerId
    );

    updateJoystick(
      event.clientX,
      event.clientY
    );
  }
);

joystick.addEventListener(
  "pointermove",
  event=>{

    if(!dragging)return;

    updateJoystick(
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

/* =========================
   JUMP
========================= */

jumpButton.addEventListener(
  "pointerdown",
  ()=>{

    const p=state.player;

    if(!state.running)return;

    if(p.y>2)return;

    p.velocityY=.72;
  }
);

/* =========================
   DASH
========================= */

dashButton.addEventListener(
  "pointerdown",
  ()=>{

    const p=state.player;

    if(!state.running)return;
    if(p.cooldown)return;

    p.cooldown=true;

    player.classList.add("dashing");

    p.x+=
      p.x<state.enemy.x
      ? 10
      : -10;

    p.x=clamp(p.x,5,90);

    setTimeout(()=>{
      player.classList.remove("dashing");
    },180);

    setTimeout(()=>{
      p.cooldown=false;
    },550);
  }
);

/* =========================
   PUNCH
========================= */

punchButton.addEventListener(
  "pointerdown",
  ()=>{

    const p=state.player;

    if(!state.running)return;
    if(p.attacking)return;
    if(p.cooldown)return;

    p.attacking=true;

    player.classList.add("punching");

    setTimeout(()=>{

      if(
        getDistance()<14 &&
        state.enemy.hp>0
      ){

        state.enemy.hp-=10;

        state.enemy.energy=
          clamp(
            state.enemy.energy+7,
            0,
            100
          );

        enemy.classList.add("hit");

        setTimeout(()=>{
          enemy.classList.remove("hit");
        },170);
      }

    },100);

    setTimeout(()=>{

      player.classList.remove("punching");

      p.attacking=false;

    },250);
  }
);

/* =========================
   KICK
========================= */

kickButton.addEventListener(
  "pointerdown",
  ()=>{

    const p=state.player;

    if(!state.running)return;
    if(p.attacking)return;

    p.attacking=true;

    player.classList.add("kicking");

    setTimeout(()=>{

      if(
        getDistance()<17 &&
        state.enemy.hp>0
      ){

        state.enemy.hp-=14;

        enemy.classList.add("hit");

        setTimeout(()=>{
          enemy.classList.remove("hit");
        },170);
      }

    },120);

    setTimeout(()=>{

      player.classList.remove("kicking");

      p.attacking=false;

    },300);
  }
);

/* =========================
   BLOCK
========================= */

function startBlock(){

  if(!state.running)return;

  state.player.blocking=true;

  player.classList.add("blocking");
}

function stopBlock(){

  state.player.blocking=false;

  player.classList.remove("blocking");
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

blockButton.addEventListener(
  "pointerleave",
  stopBlock
);

/* =========================
   SPECIAL
========================= */

specialButton.addEventListener(
  "pointerdown",
  ()=>{

    const p=state.player;

    if(!state.running)return;
    if(p.energy<100)return;
    if(p.attacking)return;

    p.energy=0;

    p.attacking=true;

    setAnnouncement("FURY",600);

    player.classList.add("punching");

    setTimeout(()=>{

      if(
        getDistance()<25 &&
        state.enemy.hp>0
      ){

        state.enemy.hp-=30;

        enemy.classList.add("hit");

        setTimeout(()=>{
          enemy.classList.remove("hit");
        },180);
      }

    },150);

    setTimeout(()=>{

      player.classList.remove("punching");

      p.attacking=false;

    },600);
  }
);

/* =========================
   PLAYER MOVEMENT
========================= */

function updatePlayer(dt){

  const p=state.player;

  if(
    Math.abs(stickX)>.08 &&
    !p.attacking &&
    state.running
  ){

    p.x+=
      stickX*.055*dt;

    p.x=clamp(p.x,5,90);

    player.classList.add("walking");

  }else{

    player.classList.remove("walking");
  }
}

/* =========================
   PHYSICS
========================= */

function updatePhysics(dt){

  const p=state.player;
  const e=state.enemy;

  p.velocityY-=.001*dt;
  p.y+=p.velocityY*dt;

  if(p.y<0){
    p.y=0;
    p.velocityY=0;
  }

  e.velocityY-=.001*dt;
  e.y+=e.velocityY*dt;

  if(e.y<0){
    e.y=0;
    e.velocityY=0;
  }

  p.energy=
    clamp(
      p.energy+.006*dt,
      0,
      100
    );

  e.energy=
    clamp(
      e.energy+.004*dt,
      0,
      100
    );
}

/* =========================
   ENEMY AI
========================= */

function updateEnemy(dt){

  const e=state.enemy;
  const p=state.player;

  aiClock-=dt;

  const distance=
    getDistance();

  if(
    distance>15 &&
    !e.attacking
  ){

    e.x+=
      (p.x>e.x?1:-1)
      *.018
      *dt;

    e.x=clamp(e.x,5,90);

    enemy.classList.add("walking");

  }else{

    enemy.classList.remove("walking");
  }

  if(aiClock<=0){

    aiClock=
      350+
      Math.random()*750;

    if(distance<17){

      const choice=
        Math.random();

      if(choice<.7){

        enemyPunch();

      }else{

        enemyBlock();
      }
    }
  }
}

function enemyPunch(){

  const e=state.enemy;

  if(e.cooldown)return;

  e.cooldown=true;
  e.attacking=true;

  enemy.classList.add("punching");

  setTimeout(()=>{

    if(
      getDistance()<16 &&
      state.player.hp>0
    ){

      let damage=9;

      if(state.player.blocking)
        damage=2;

      state.player.hp-=damage;

      e.energy=
        clamp(
          e.energy+8,
          0,
          100
        );
    }

  },110);

  setTimeout(()=>{

    enemy.classList.remove("punching");

    e.attacking=false;

  },270);

  setTimeout(()=>{
    e.cooldown=false;
  },650);
}

function enemyBlock(){

  const e=state.enemy;

  if(e.attacking)return;

  e.blocking=true;

  enemy.classList.add("blocking");

  setTimeout(()=>{

    e.blocking=false;

    enemy.classList.remove("blocking");

  },500);
}

/* =========================
   ROUND END
========================= */

function finishRound(message){

  if(!state.running)return;

  state.running=false;

  player.classList.remove(
    "walking",
    "punching",
    "kicking",
    "blocking",
    "dashing"
  );

  enemy.classList.remove(
    "walking",
    "punching",
    "blocking"
  );

  setAnnouncement(message);

  setTimeout(resetRound,2200);
}

function resetRound(){

  state.player.x=23;
  state.player.y=0;
  state.player.hp=100;
  state.player.energy=25;
  state.player.velocityY=0;
  state.player.attacking=false;
  state.player.blocking=false;
  state.player.cooldown=false;

  state.enemy.x=68;
  state.enemy.y=0;
  state.enemy.hp=100;
  state.enemy.energy=25;
  state.enemy.velocityY=0;
  state.enemy.attacking=false;
  state.enemy.blocking=false;
  state.enemy.cooldown=false;

  state.time=60;
  state.running=true;

  announcement.textContent="";

  render();
}

/* =========================
   GAME LOOP
========================= */

function gameLoop(now){

  const dt=
    Math.min(
      now-previousTime,
      40
    );

  previousTime=now;

  if(state.running){

    updatePlayer(dt);
    updatePhysics(dt);
    updateEnemy(dt);

    if(state.player.hp<=0){

      finishRound("RIVAL WINS");

    }else if(state.enemy.hp<=0){

      finishRound("FURY WINS");

    }else if(state.time<=0){

      if(
        state.player.hp>
        state.enemy.hp
      ){

        finishRound("FURY WINS");

      }else if(
        state.enemy.hp>
        state.player.hp
      ){

        finishRound("RIVAL WINS");

      }else{

        finishRound("DRAW");
      }
    }
  }

  render();

  requestAnimationFrame(gameLoop);
}

/* =========================
   TIMER
========================= */

setInterval(()=>{

  if(!state.running)return;

  state.time--;

  timerElement.textContent=
    Math.max(0,state.time);

},1000);

/* =========================
   START
========================= */

render();

requestAnimationFrame(gameLoop);
