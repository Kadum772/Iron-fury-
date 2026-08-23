const player = document.getElementById("player");
const enemy = document.getElementById("enemy");

const playerHP = document.getElementById("playerHP");
const enemyHP = document.getElementById("enemyHP");

const playerEnergy = document.getElementById("playerEnergy");
const enemyEnergy = document.getElementById("enemyEnergy");

const timer = document.getElementById("timer");
const announcement = document.getElementById("announcement");

const joystick = document.getElementById("joystick");
const stick = document.getElementById("stick");

const jumpBtn = document.getElementById("jump");
const dashBtn = document.getElementById("dash");
const attackBtn = document.getElementById("attack");
const kickBtn = document.getElementById("kick");
const blockBtn = document.getElementById("block");
const specialBtn = document.getElementById("special");

let p = {
  x:25,
  y:0,
  hp:100,
  energy:30,
  vy:0,
  attacking:false,
  blocking:false,
  cooldown:false
};

let e = {
  x:70,
  y:0,
  hp:100,
  energy:30,
  vy:0,
  attacking:false,
  blocking:false,
  cooldown:false
};

let joystickX = 0;
let joystickY = 0;
let dragging = false;

let time = 60;
let running = true;
let lastTime = performance.now();
let aiTimer = 0;

/* ================= HELPERS ================= */

function clamp(v,min,max){
  return Math.max(min,Math.min(max,v));
}

function distance(){
  return Math.abs(p.x-e.x);
}

function render(){

  player.style.left = p.x + "%";
  enemy.style.left = e.x + "%";

  player.style.bottom =
    `calc(25% + ${p.y}px)`;

  enemy.style.bottom =
    `calc(25% + ${e.y}px)`;

  playerHP.style.width =
    p.hp + "%";

  enemyHP.style.width =
    e.hp + "%";

  playerEnergy.style.width =
    p.energy + "%";

  enemyEnergy.style.width =
    e.energy + "%";

  if(p.x <= e.x){
    player.style.transform = "scaleX(1)";
    enemy.style.transform = "scaleX(-1)";
  }else{
    player.style.transform = "scaleX(-1)";
    enemy.style.transform = "scaleX(1)";
  }
}

/* ================= JOYSTICK ================= */

function resetStick(){
  dragging=false;
  joystickX=0;
  joystickY=0;

  stick.style.left="50%";
  stick.style.top="50%";
}

function moveStick(x,y){

  const r =
    joystick.getBoundingClientRect();

  const cx =
    r.left+r.width/2;

  const cy =
    r.top+r.height/2;

  let dx=x-cx;
  let dy=y-cy;

  const max=r.width/2-27;

  const d=Math.hypot(dx,dy);

  if(d>max){
    dx=dx/d*max;
    dy=dy/d*max;
  }

  joystickX=dx/max;
  joystickY=dy/max;

  stick.style.left =
    `calc(50% + ${dx}px)`;

  stick.style.top =
    `calc(50% + ${dy}px)`;
}

joystick.addEventListener(
  "pointerdown",
  ev=>{
    dragging=true;
    joystick.setPointerCapture(ev.pointerId);
    moveStick(ev.clientX,ev.clientY);
  }
);

joystick.addEventListener(
  "pointermove",
  ev=>{
    if(dragging)
      moveStick(ev.clientX,ev.clientY);
  }
);

joystick.addEventListener(
  "pointerup",
  resetStick
);

joystick.addEventListener(
  "pointercancel",
  resetStick
);

/* ================= JUMP ================= */

jumpBtn.addEventListener(
  "pointerdown",
  ()=>{
    if(!running || p.y>2)return;

    p.vy=.65;
  }
);

/* ================= DASH ================= */

dashBtn.addEventListener(
  "pointerdown",
  ()=>{
    if(!running || p.cooldown)return;

    p.cooldown=true;

    player.classList.add("dashing");

    p.x +=
      p.x<e.x ? 9 : -9;

    p.x=clamp(p.x,5,90);

    setTimeout(()=>{
      player.classList.remove("dashing");
    },180);

    setTimeout(()=>{
      p.cooldown=false;
    },600);
  }
);

/* ================= PUNCH ================= */

attackBtn.addEventListener(
  "pointerdown",
  ()=>{
    if(!running || p.attacking || p.cooldown)return;

    p.attacking=true;

    player.classList.add("punching");

    setTimeout(()=>{

      if(distance()<14){
        e.hp-=10;
        e.energy=clamp(e.energy+8,0,100);
      }

    },100);

    setTimeout(()=>{
      player.classList.remove("punching");
      p.attacking=false;
    },240);
  }
);

/* ================= KICK ================= */

kickBtn.addEventListener(
  "pointerdown",
  ()=>{
    if(!running || p.attacking || p.cooldown)return;

    p.attacking=true;

    player.classList.add("kicking");

    setTimeout(()=>{

      if(distance()<17){
        e.hp-=14;
        e.energy=clamp(e.energy+10,0,100);
      }

    },120);

    setTimeout(()=>{
      player.classList.remove("kicking");
      p.attacking=false;
    },300);
  }
);

/* ================= BLOCK ================= */

blockBtn.addEventListener(
  "pointerdown",
  ()=>{
    if(!running)return;

    p.blocking=true;
    player.classList.add("blocking");
  }
);

blockBtn.addEventListener(
  "pointerup",
  ()=>{
    p.blocking=false;
    player.classList.remove("blocking");
  }
);

blockBtn.addEventListener(
  "pointercancel",
  ()=>{
    p.blocking=false;
    player.classList.remove("blocking");
  }
);

/* ================= SPECIAL ================= */

specialBtn.addEventListener(
  "pointerdown",
  ()=>{
    if(!running)return;
    if(p.energy<100)return;
    if(p.attacking)return;

    p.energy=0;
    p.attacking=true;

    announcement.textContent="FURY";

    player.classList.add("punching");

    setTimeout(()=>{

      if(distance()<24){
        e.hp-=30;
      }

    },150);

    setTimeout(()=>{
      player.classList.remove("punching");
      p.attacking=false;

      if(running)
        announcement.textContent="";
    },550);
  }
);

/* ================= ENEMY AI ================= */

function enemyAI(dt){

  aiTimer-=dt;

  const d=distance();

  if(d>14 && !e.attacking){

    e.x +=
      (p.x>e.x ? 1 : -1)
      * .018
      * dt;

    e.x=clamp(e.x,5,90);

    enemy.classList.add("walking");

  }else{

    enemy.classList.remove("walking");
  }

  if(aiTimer<=0){

    aiTimer=
      450+
      Math.random()*700;

    if(d<16){

      const r=Math.random();

      if(r<.65){
        enemyAttack();
      }
      else if(r<.85){
        enemyBlock();
      }
    }
  }
}

function enemyAttack(){

  if(e.cooldown)return;

  e.cooldown=true;
  e.attacking=true;

  enemy.classList.add("punching");

  setTimeout(()=>{

    if(distance()<15){

      let damage=8;

      if(p.blocking)
        damage=2;

      p.hp-=damage;

      e.energy=
        clamp(e.energy+10,0,100);
    }

  },110);

  setTimeout(()=>{
    enemy.classList.remove("punching");
    e.attacking=false;
  },260);

  setTimeout(()=>{
    e.cooldown=false;
  },600);
}

function enemyBlock(){

  e.blocking=true;

  enemy.classList.add("blocking");

  setTimeout(()=>{
    e.blocking=false;
    enemy.classList.remove("blocking");
  },500);
}

/* ================= PHYSICS ================= */

function physics(dt){

  p.vy-=.0009*dt;
  p.y+=p.vy*dt;

  if(p.y<0){
    p.y=0;
    p.vy=0;
  }

  e.vy-=.0009*dt;
  e.y+=e.vy*dt;

  if(e.y<0){
    e.y=0;
    e.vy=0;
  }

  if(
    Math.abs(joystickX)>.08 &&
    !p.attacking &&
    running
  ){

    p.x +=
      joystickX*.055*dt;

    p.x=clamp(p.x,5,90);

    player.classList.add("walking");

  }else{

    player.classList.remove("walking");
  }

  p.energy=
    clamp(p.energy+.004*dt,0,100);

  e.energy=
    clamp(e.energy+.003*dt,0,100);
}

/* ================= ROUND ================= */

function finish(text){

  if(!running)return;

  running=false;

  announcement.textContent=text;

  setTimeout(newRound,2200);
}

function newRound(){

  p.x=25;
  e.x=70;

  p.y=0;
  e.y=0;

  p.vy=0;
  e.vy=0;

  p.hp=100;
  e.hp=100;

  p.energy=30;
  e.energy=30;

  p.attacking=false;
  e.attacking=false;

  p.blocking=false;
  e.blocking=false;

  time=60;

  announcement.textContent="";

  running=true;

  render();
}

/* ================= GAME LOOP ================= */

function loop(now){

  const dt =
    Math.min(now-lastTime,40);

  lastTime=now;

  if(running){

    physics(dt);
    enemyAI(dt);

    if(p.hp<=0)
      finish("RIVAL WINS");

    else if(e.hp<=0)
      finish("FURY WINS");

    else if(time<=0){

      if(p.hp>e.hp)
        finish("FURY WINS");
      else if(e.hp>p.hp)
        finish("RIVAL WINS");
      else
        finish("DRAW");
    }
  }

  render();

  requestAnimationFrame(loop);
}

/* ================= TIMER ================= */

setInterval(()=>{

  if(!running)return;

  time--;

  timer.textContent =
    Math.max(0,time);

},1000);

/* ================= START ================= */

render();

requestAnimationFrame(loop);
