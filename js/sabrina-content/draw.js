
function drawRect(ctx, x, y, width, height, border) {
    if (typeof border.fill === 'undefined') {
        border.fill = false;
    }
    if (typeof border.width === 'undefined') {
        border.width = 0;
    }
    if (typeof border.radius === 'undefined') {
        border.radius = 0;
    }
    let radius;
    if (typeof border.radius === 'number') {
        radius = {tl: border.radius, tr: border.radius, br: border.radius, bl: border.radius};
    } else {
        var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
        for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }

    ctx.lineWidth = border.width;
    ctx.fillStyle = border.color;
    ctx.strokeStyle = border.color;
    ctx.shadowColor = border.color;
    ctx.shadowBlur = border.glow ? 30 : 0;

    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (border.fill) {
        ctx.fillStyle = border.color;
        ctx.fill();
    }
    if (border.width) {
        ctx.stroke();
    }
}

function drawText(canvas, settings, text) {
    clearCanvas(canvas);
    const ctx = canvas.getContext("2d");
    const font = settings.font.font;
    const color = settings.font.color;
    const size = settings.font.size;

    text = wrapText(ctx, text, 500);
    const lines = text.split('\n');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${size}px ${font}`;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const textWidth = ctx.measureText(text).width;

    let maxLineWidth = 0;
    for (let i = 0; i < lines.length; i++) {
        let lineWidth = ctx.measureText(lines[i]).width;
        maxLineWidth = Math.max(maxLineWidth, lineWidth);
    }

    const padding = 10;
    const boxWidth = maxLineWidth + padding * 2;
    const boxHeight = padding * 2 + size * lines.length;

    let x = (canvas.width - boxWidth) / 2;
    let y = (canvas.height - boxHeight) / 2;

    drawRect(ctx, x, y, boxWidth, boxHeight, settings.border);

    ctx.fillStyle = settings.font.color;
    ctx.shadowColor = settings.font.color;
    for (let i = 1; i <= lines.length; i++) {
        ctx.fillText(lines[i - 1], canvas.width / 2, (canvas.height - boxHeight - padding) / 2 + i * size);
    }
}

function clearCanvas(canvas) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function wrapText(context, text, maxWidth) {
    let words = text.split(' ');
    let lines = [];
    let currentLine = words[0];

    for(let i = 1; i < words.length; i++) {
        let word = words[i];
        let width = context.measureText(currentLine + ' ' + word).width;
        console.log(width)
        if(width < maxWidth) {
            currentLine += ' ' + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines.join('\n');
}