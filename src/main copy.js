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

// const pipeImage = new Image();
// pipeImage.onload = () => {
//   pipeImage.sr
// }
// pipeImage.src = "fire-fire-emote.gif";




// let pipeGifFrames = null;
// let pipeready=false

// console.log(gifler('fire-fire-emote.gif'));

// gifler('fire-fire-emote.gif').get(anim => {
//   console.log(anim);
//   anim.animateInCanvas(canvas)
//   // pipeGifFrames = anim;
//   // anim.start();

//   anim.onDrawFrame = (ctx, frame) => {
//     console.log(frame);

//     pipeGifFrames = frame.buffer; // Current frame
//     pipeready = true;
//   };


// });


let pipeGifFrames = []; // Array to hold {image: Image, delay: number} objects
// let pipeready = false;
let gifFrameIndex = 0;
let gifDelay = 0;
let lastGifUpdate = 0;
const GIF_UPDATE_INTERVAL = 1000 / 15; // Target 15 FPS for the GIF animation (or use GIF's actual delays)


// gifler("public/fire-fire-emote.gif").get(anim => {
//   // Store frames and their delays
//   console.log(anim._frames[0]);

//   pipeGifFrames = anim._frames.map(frame => ({
//     image: frame.image,
//     delay: frame.delay // Use the GIF's actual delay if you prefer
//   }));

//   // Set initial delay and mark ready
//   if (pipeGifFrames.length > 0) {
//     gifDelay = pipeGifFrames[0].delay;
//     pipeready = true;
//   }
//   console.log("GIF frames loaded:", pipeGifFrames.length);
// });



const pipeImage = document.getElementById('pipeGifSource');
let pipeready = false;

console.log(pipeImage);


// Once the browser loads the GIF, it starts animating it internally.
// pipeImage.onload = () => {
//   pipeready = true;
//   console.log("GIF loaded and ready as an animating image source.");
// };

pipeImage.onload = () => {
  // If the browser is fast and loads before the listener, we still need to run the logic.
  setTimeout(() => {
    pipeready = true;
    console.log("GIF is ready and animation should be active.");
  }, 50);
};



if (pipeImage.complete) {
  // Manually call the logic if it's already done
  pipeImage.onload();
}




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

  if (!pipeready) return;

  console.log(pipeImage);


  const currentFrameImage = pipeImage;

  // console.log(currentFrameImage);


  pipes.forEach(pipe => {
    // Top pipe
    // ctx.drawImage()
    // ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    // Bottom pipe
    // ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);

    // ctx.drawImage(pipeImage, pipe.x, 0, pipe.width, pipe.top);


    // ctx.drawImage(pipeImage, pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);


    // 🎬 Draw the video background
    // if (!video.paused && !video.ended) {
    //   ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    // }

    ctx.drawImage(
      currentFrameImage,
      pipe.x,
      0,
      pipe.width,
      pipe.top // Scales the GIF to the pipe dimensions
    );

    // console.log(pipeGifFrames);

    // ctx.drawImage(pipeGifFrames, pipe.x, 0, pipe.width, pipe.top);

    // ctx.drawImage(
    //   pipeGifFrames,
    //   pipe.x,
    //   0,
    //   pipe.width,
    //   pipe.top
    // );

    // Top pipe
    // pipeGifFrames.moveTo(pipe.x, 0);
    // pipeGifFrames.draw(ctx);

    // Bottom pipe
    // pipeGifFrames.moveTo(pipe.x, pipe.bottom);
    // pipeGifFrames.draw(ctx);





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