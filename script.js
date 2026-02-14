const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set dimensions
canvas.width = 800;
canvas.height = 400;

// Game Variables
let gravity = 0.6;
let jumpStrength = -10;
let attempts = 1;
let gameActive = true;

const player = {
    x: 100,
    y: 300,
    size: 30,
    dy: 0,
    jump() {
        if (this.y + this.size >= 350) { // Check if on floor
            this.dy = jumpStrength;
        }
    },
    update() {
        this.dy += gravity;
        this.y += this.dy;

        // Floor collision
        if (this.y + this.size > 350) {
            this.y = 350 - this.size;
            this.dy = 0;
        }
    },
    draw() {
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(this.x, this.y, this.size, this.size);
        // Add a simple "eye" to show direction
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x + 20, this.y + 5, 5, 5);
    }
};

const obstacles = [
    { x: 600, y: 310, width: 40, height: 40 },
    { x: 1000, y: 310, width: 40, height: 40 }
];

function drawFloor() {
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 350);
    ctx.lineTo(800, 350);
    ctx.stroke();
}

function checkCollision(p, o) {
    return p.x < o.x + o.width &&
           p.x + p.size > o.x &&
           p.y < o.y + o.height &&
           p.y + p.size > o.y;
}

function resetGame() {
    attempts++;
    document.getElementById('score').innerText = `Attempts: ${attempts}`;
    obstacles.forEach((obs, index) => {
        obs.x = 600 + (index * 400);
    });
    player.y = 300;
    player.dy = 0;
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawFloor();
    player.update();
    player.draw();

    obstacles.forEach(obs => {
        obs.x -= 6; // Scroll speed
        
        // Reset obstacle when off-screen
        if (obs.x < -50) obs.x = 800 + Math.random() * 200;

        // Draw Spike (Triangle)
        ctx.fillStyle = '#ff4444';
        ctx.beginPath();
        ctx.moveTo(obs.x, obs.y + obs.height);
        ctx.lineTo(obs.x + obs.width / 2, obs.y);
        ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
        ctx.fill();

        if (checkCollision(player, obs)) {
            resetGame();
        }
    });

    requestAnimationFrame(animate);
}

// Controls
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') player.jump();
});

// Start
animate();
