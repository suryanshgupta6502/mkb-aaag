// --- DOM Elements ---
const gameContainer = document.getElementById("game-container");
const birdElement = document.getElementById("bird");
const scoreDisplay = document.getElementById("score-display");


const container = document.querySelector("#game-container");
const rect = container.getBoundingClientRect();
console.log(rect.width);

const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);


// --- Constants ---
const GAME_WIDTH = rect.width
const GAME_HEIGHT = rect.height
const PIPE_SPEED = 3;
const PIPE_GAP = 250;
const PIPE_INTERVAL = 200;

// --- Audio ---
const bnc = new Audio("bn.mp3");
const mkb = new Audio("maka-bhosda-aag-meme-amitabh-bachan-made-with-Voicemod.mp3");

// --- Game State ---
let bird, pipes, frame, score, gameOver;
// console.log(document.querySelector("#bird").style.width);
const bird_bound = document.querySelector("#bird").getBoundingClientRect()
console.log(bird_bound.width);

// --- Bird Properties ---
function initBird() {
  return {
    x: rect.width / 3,
    y: 150,
    width: bird_bound.width,
    height: bird_bound.height,
    gravity: 0.6,
    lift: -10,
    velocity: 0
  };
}

// --- Event Listeners ---
document.querySelector(".playbutton").addEventListener("click", (e) => {
  bnc.currentTime = 0;
  bnc.play();
  document.querySelector(".playbutton").style.display = "none"

  restartGame()
});


function handleJump() {
  if (gameOver) {
    // restartGame();
    return;
  }
  bird.velocity = bird.lift; // negative velocity => jump
  bnc.currentTime = 0;
  bnc.play();
}

document.addEventListener("keydown", e => {
  if (e.code === "Space") {
    handleJump()
  }
});

document.addEventListener("touchstart", e => {
  handleJump();
});

// let lastTime
// --- Restart Game ---
function restartGame() {
  // Clean up existing pipes
  if (pipes) pipes.forEach(p => p.element.remove());

  // Reset state
  bird = initBird();
  pipes = [];
  frame = 0;
  score = 0;
  gameOver = false;
  // lastTime = null



  // Position bird visually
  birdElement.style.top = bird.y + "px";
  birdElement.style.left = bird.x + "px";
  scoreDisplay.textContent = "Score: 0";

  loop();
  // requestAnimationFrame(loop)

}

// --- Create a Pipe ---
function createPipe() {
  const topHeight = Math.random() * (GAME_HEIGHT - PIPE_GAP - 100) + 50;

  const pipeContainer = document.createElement("div");
  pipeContainer.className = "pipe-container";

  const topPipe = document.createElement("div");
  topPipe.className = "pipe-top";
  topPipe.style.height = topHeight + "px";

  console.log(topPipe.style.height);

  const bottomPipe = document.createElement("div");
  bottomPipe.className = "pipe-bottom";
  bottomPipe.style.height = GAME_HEIGHT - (topHeight + PIPE_GAP) + "px";

  pipeContainer.appendChild(topPipe);
  pipeContainer.appendChild(bottomPipe);
  gameContainer.appendChild(pipeContainer);

  pipes.push({
    element: pipeContainer,
    x: GAME_WIDTH,
    width: 50,
    top: topHeight,
    bottom: topHeight + PIPE_GAP,
    scored: false
  });
}

// --- Update Bird ---
function updateBird(delta) {
  const dt = delta / 16.67

  bird.velocity += bird.gravity * dt;   // gravity pulls down
  bird.y += bird.velocity * dt;         // update position

  // boundary collision
  if (bird.y <= 0 || bird.y + bird.height >= GAME_HEIGHT) {
    triggerGameOver();
  }

  birdElement.style.top = bird.y + "px";   // visual update
}



// --- Update Pipes ---
function updatePipes(delta) {
  const dt = delta / 16.67
  pipes.forEach(pipe => {
    pipe.x -= PIPE_SPEED * dt;
    pipe.element.style.left = pipe.x + "px";

    // Collision
    if (detectCollision(pipe)) triggerGameOver();

    // Scoring
    if (!pipe.scored && pipe.x + pipe.width < bird.x) {
      pipe.scored = true;
      score++;
    }
  });

  // Remove offscreen pipes
  pipes = pipes.filter(pipe => {
    if (pipe.x + pipe.width < 0) {
      pipe.element.remove();
      return false;
    }
    return true;
  });

  // Add new pipe
  if (frame % PIPE_INTERVAL === 0) createPipe();
}

// --- Collision Detection ---
function detectCollision(pipe) {
  const tolerance = 70;
  // console.log(bird.y, bird.height);

  return (
    bird.x < pipe.x + pipe.width &&
    bird.x + bird.width > pipe.x &&
    (bird.y < (pipe.top - tolerance) || bird.y + bird.height > (pipe.bottom + tolerance))
  );
}

// --- Game Over ---
function triggerGameOver() {
  if (gameOver) return;
  gameOver = true;
  mkb.currentTime = 0;
  mkb.play();

  console.log(document.querySelector(".playbutton").style.display);


  document.querySelector(".playbutton").style.display = "flex"
  // console.log(document.querySelector(".playbutton").style.display="flex")

}


let lastTime = 0
// --- Main Game Loop ---
function loop(timestamp) {
  if (gameOver) return;

  if (!lastTime) lastTime = timestamp;
  let delta = timestamp - lastTime; // time in ms since last frame
  lastTime = timestamp;

  delta = Math.min(delta, 8);

  console.log(delta);


  // if (lastTime === null) {
  //   // This is the first frame after a restart.
  //   // We set lastTime and exit, waiting for the next frame to calculate movement.
  //   lastTime = currentTime;
  //   requestAnimationFrame(loop);
  //   return;
  // }

  // Calculation for all subsequent frames
  // const deltaTime = currentTime - lastTime;
  // const TARGET_FPS_INTERVAL = 1000 / 60;
  // const timeScale = deltaTime / TARGET_FPS_INTERVAL;


  const deltaCap = isMobile ? 8 : 20;

  if (deltaCap) {

    updateBird(deltaCap);
    updatePipes(deltaCap);

  }




  scoreDisplay.textContent = `Score: ${score}`;
  frame++;
  requestAnimationFrame(loop);
}
