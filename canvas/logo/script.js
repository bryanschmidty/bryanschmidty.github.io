const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const yourName = "Bryan Schmidt"; // Replace with your name

const fontUrl = 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxP.ttf'; // URL of the font file (Roboto Regular in this case)

let font;

function createLetterPath(letter) {
    const fontSize = 100;
    const pathData = font.getPath(letter, 0, 0, fontSize).commands;
    const path = new Path2D();

    for (const command of pathData) {
        if (command.type === 'M') {
            path.moveTo(command.x, command.y);
        } else if (command.type === 'L') {
            path.lineTo(command.x, command.y);
        } else if (command.type === 'C') {
            path.bezierCurveTo(command.x1, command.y1, command.x2, command.y2, command.x, command.y);
        } else if (command.type === 'Q') {
            path.quadraticCurveTo(command.x1, command.y1, command.x, command.y);
        } else if (command.type === 'Z') {
            path.closePath();
        }
    }

    return path;
}

function createLetterPaths() {
    const letters = {};
    for (const letter of yourName) {
        if (!letters[letter]) {
            letters[letter] = createLetterPath(letter);
        }
    }
    return letters;
}

function drawLetter(letter, x, y) {
    const path = letterPaths[letter];
    console.log(letter, path)
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1, -1); // Flip the letters vertically
    ctx.stroke(path);
    ctx.restore();
}

function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'white'; // Set the stroke color to white

    for (let i = 0; i < yourName.length; i++) {
        const char = yourName[i];
        const x = canvas.width / 2 - ctx.measureText(yourName).width / 2 + ctx.measureText(yourName.substring(0, i)).width;
        const y = canvas.height / 2;

        drawLetter(char, x, y);
    }
}

function animate() {
    // ctx.rotate(0.005);
    draw();
    requestAnimationFrame(animate);
}


window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

let letterPaths;
opentype.load(fontUrl, (err, loadedFont) => {
    if (err) {
        console.error('Error loading font: ', err);
    } else {
        font = loadedFont;
        ctx.font = '100px Roboto'; // Set the font style to match the loaded font
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        letterPaths = createLetterPaths();

        // drawLetter.path = letterPaths;
        // draw.path = letterPaths;

        animate();
    }
});
