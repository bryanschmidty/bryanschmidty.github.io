// Set up the canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set the canvas dimensions to match the size of the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Set up the snowflakes array
const snowflakes = [];

// Set up the function to draw a single snowflake
function drawSnowflake(x, y, radius) {
    ctx.beginPath();

    // Draw the left arm of the snowflake
    ctx.moveTo(x - radius, y);
    ctx.lineTo(x - radius * 0.5, y - radius * 0.5);
    ctx.lineTo(x - radius * 0.5, y + radius * 0.5);

    // Draw the top arm of the snowflake
    ctx.moveTo(x, y - radius);
    ctx.lineTo(x - radius * 0.5, y - radius * 0.5);
    ctx.lineTo(x + radius * 0.5, y - radius * 0.5);

    // Draw the right arm of the snowflake
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + radius * 0.5, y - radius * 0.5);
    ctx.lineTo(x + radius * 0.5, y + radius * 0.5);

    // Draw the bottom arm of the snowflake
    ctx.moveTo(x, y + radius);
    ctx.lineTo(x - radius * 0.5, y + radius * 0.5);
    ctx.lineTo(x + radius * 0.5, y + radius * 0.5);

    // Draw the center of the snowflake
    ctx.arc(x, y, radius * 0.5, 0, Math.PI * 2);

    ctx.fillStyle = 'white';
    ctx.fill();
}


// Set up the Snowflake constructor function
function Snowflake(x, y, radius, speed) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed = speed;
}

// Set up the prototype method for the Snowflake constructor function to draw a snowflake
Snowflake.prototype.draw = function() {
    drawSnowflake(this.x, this.y, this.radius);
}

// Set up the prototype method for the Snowflake constructor function to update the snowflake's position
Snowflake.prototype.update = function() {
    this.y += this.speed;

    // If the snowflake goes off the bottom of the screen, reset its position to the top
    if (this.y > canvas.height) {
        this.y = 0;
    }
}

// Set up the function to generate a random number within a given range
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// Set up the function to create a new snowflake
function createSnowflake() {
    // Generate a random x position within the canvas
    const x = random(0, canvas.width);

    // Generate a random radius for the snowflake
    const radius = random(2, 5);

    // Generate a random speed for the snowflake
    const speed = random(1, 3);

    // Create a new snowflake object and push it to the snowflakes array
    snowflakes.push(new Snowflake(x, 0, radius, speed));
}

// Set up the function to animate the snowfall
function animate() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Loop through the snowflakes array and update and draw each snowflake
    for (let i = 0; i < snowflakes.length; i++) {
        snowflakes[i].update();
        snowflakes[i].draw();
    }

    // Call the animate function again using requestAnimationFrame
    requestAnimationFrame(animate);
}

// Generate a certain number of snowflakes to start
for (let i = 0; i < 100; i++) {
    createSnowflake();
}

// Start the animation
animate();
