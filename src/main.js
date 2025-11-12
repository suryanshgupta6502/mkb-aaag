const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);



const bc = new Audio("bn.mp3")
const mkb = new Audio("maka-bhosda-aag-meme-amitabh-bachan-made-with-Voicemod.mp3")

document.querySelector(".playbutton").addEventListener("click", () => {

  bc.currentTime = 0
  bc.play()


  // Start the game

  restartGame()

})











// Bird properties
let bird = {
  x: window.innerWidth / 2,
  y: 150,
  width: 30,
  height: 30,
  gravity: .6,
  lift: -10,
  velocity: 0,
  speed: 1
};

// Pipes
let pipes = [];
let frame = 0;
let score = 0;

// Game control
let gameOver = false;

// Listen for spacebar press
document.addEventListener("keydown", function (e) {
  if (e.code === "Space") {
    bird.velocity = bird.lift;
    bc.currentTime = 0
    bc.play()
    if (gameOver) restartGame();
  }
});

function restartGame() {
  bird.y = 150;
  bird.velocity = 0;
  pipes = [];
  frame = 0;
  score = 0;
  gameOver = false;
  loop();
}

// Create pipes
function createPipe() {
  let gap = 250; // Gap between top and bottom pipes

  let top = Math.random() * (canvas.height - gap - 100) + 50;
  pipes.push({
    x: canvas.width,
    top: top,
    bottom: top + gap,
    width: 50
  });
}

// Draw bird
function drawBird() {
  ctx.fillStyle = "yellow";
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

// Draw pipes
function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach(pipe => {
    // Top pipe
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    // Bottom pipe
    ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
  });
}

// Update pipes
function updatePipes() {
  pipes.forEach(pipe => {
    pipe.x -= 3;
  });

  // Remove offscreen pipes
  pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);

  // Create new pipes periodically
  if (frame % 200 === 0) createPipe();
}

// Collision detection
function detectCollision(pipe) {
  return (
    bird.x < pipe.x + pipe.width &&
    bird.x + bird.width > pipe.x &&
    (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
  );
}

// Main game loop
function loop() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update bird
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  // Prevent bird from falling off
  if (bird.y + bird.height >= canvas.height) {
    gameOver = true;
  }

  // Update pipes and check collisions
  updatePipes();

  pipes.forEach(pipe => {
    if (detectCollision(pipe)) {
      gameOver = true;
      mkb.currentTime = 0
      mkb.play()

    }

    if (pipe.x + pipe.width === bird.x) {
      score++;
    }
  });

  // Draw everything
  drawBird();
  drawPipes();

  // Draw score
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);

  frame++;
  requestAnimationFrame(loop);
}


// loop();