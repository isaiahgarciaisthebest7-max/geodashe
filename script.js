const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 400;

// --- Game Settings ---
let gravity = 0.5;      // Slightly lower gravity
let jumpStrength = -9;
let gameSpeed = 4;      // Reduced speed (was 6)
let distanceTraveled = 0;
let levelLength = 5000; // Total distance to "win"
let attempts = 1;

const player = {
    x: 100,
    y: 300,
    size: 30,
    dy: 0,
    jump() {
        // MECHANIC CHANGE: Jumping now resets the game
        console.log("Jumped! Game Over.");
        resetGame();
    },
    update() {
        this.dy += gravity;
        this.y += this.dy;

        if (this.y + this.size > 350) {
            this.y = 350 - this.size;
            this.dy = 0;
        }
    },
    draw() {
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
};

const obstacles = [
    { x: 600, width: 40, height: 40 },
    { x: 1100, width: 40, height: 40 }
];

function drawUI() {
    // 1. Progress Bar Background
    ctx.fillStyle = '#333';
    ctx.fillRect(200, 20, 400, 10);

    // 2. Progress Fill
    let progress = Math.min(distanceTraveled / levelLength, 1);
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(200, 20, 400 * progress, 10);

    // 3. Percent Text
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.fillText(`${Math.floor(progress * 100)}%`, 610, 30);
}

function resetGame() {
    attempts++;
    document.getElementById('score').innerText = `Attempts: ${attempts}`;
    distanceTraveled = 0; // Reset progress
    obstacles[0].x = 600;
    obstacles[1].x = 1100;
    player.y = 300;
    player.dy = 0;
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Floor
    ctx.strokeStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(0, 350);
    ctx.lineTo(800, 350);
    ctx.stroke();

    drawUI();
    player.update();
    player.draw();

    distanceTraveled += gameSpeed;

    obstacles.forEach(obs => {
        obs.x -= gameSpeed;
        
        if (obs.x < -50) obs.x = 800 + Math.random() * 300;

        // Draw Spike
        ctx.fillStyle = '#ff4444';
        ctx.beginPath();
        ctx.moveTo(obs.x, 350);
        ctx.lineTo(obs.x + obs.width / 2, 350 - obs.height);
        ctx.lineTo(obs.x + obs.width, 350);
        ctx.fill();

        // Collision
        if (player.x < obs.x + obs.width &&
            player.x + player.size > obs.x &&
            player.y + player.size > 350 -
