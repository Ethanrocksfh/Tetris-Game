const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Canvas size
canvas.width = 320;
canvas.height = 480;

// Bird
const bird = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    speed: 0,
    gravity: 0.6,
    lift: -15
};

// Pipes
const pipes = [];
const pipeWidth = 50;
const pipeGap = 100;
const pipeSpeed = 2;

// Game variables
let score = 0;
let isGameOver = false;

// Controls
document.addEventListener("keydown", () => {
    if (!isGameOver) {
        bird.speed = bird.lift;
    }
});

// Update game state
function update() {
    if (isGameOver) return;

    bird.speed += bird.gravity;
    bird.y += bird.speed;

    // Check for collision with the ground
    if (bird.y + bird.height >= canvas.height) {
        isGameOver = true;
        bird.y = canvas.height - bird.height;
    }

    // Pipe logic
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        pipes.push({
            x: canvas.width,
            y: Math.floor(Math.random() * (canvas.height - pipeGap)),
            passed: false
        });
    }

    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;

        // Check for pipe collision
        if (pipe.x < bird.x + bird.width && pipe.x + pipeWidth > bird.x) {
            if (bird.y < pipe.y || bird.y + bird.height > pipe.y + pipeGap) {
                isGameOver = true;
            }
        }

        // Score update
        if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
            score++;
            pipe.passed = true;
        }
    });

    // Remove off-screen pipes
    pipes.forEach((pipe, index) => {
        if (pipe.x + pipeWidth < 0) {
            pipes.splice(index, 1);
        }
    });

    // Clear canvas and redraw everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ff0";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height); // Draw bird

    pipes.forEach(pipe => {
        ctx.fillStyle = "#008000";
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.y); // Top pipe
        ctx.fillRect(pipe.x, pipe.y + pipeGap, pipeWidth, canvas.height - (pipe.y + pipeGap)); // Bottom pipe
    });

    // Display score
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);

    if (isGameOver) {
        ctx.fillText("Game Over", canvas.width / 2 - 50, canvas.height / 2);
    }
}

// Game loop
function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

gameLoop();
