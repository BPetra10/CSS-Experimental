class LeavesBackground {
  paint(ctx, size) {
    const { width, height } = size;

    ctx.fillStyle = "beige";
    ctx.fillRect(0, 0, width, height);

    const leafColors = ["green", "#cebc47ff", "#ee8830ff", "#800606ff"];

    const offsets = [
      [15, -10], [-20, 5], [10, 20], [-25, -15], [5, 10]
    ];

    const leavesSpacing = 120;
    const cols = Math.ceil(width / leavesSpacing);
    const rows = Math.ceil(height / leavesSpacing);

    let colorIndex = 0;

    for (let row = 0; row <= rows; row++) {
      for (let col = 0; col <= cols; col++) {
        const baseX = (col + 0.5) * leavesSpacing;
        const baseY = (row + 0.5) * leavesSpacing;

        const index = (row * cols + col) % offsets.length;
        const [offsetX, offsetY] = offsets[index];
        
        const x = baseX + offsetX;
        const y = baseY + offsetY;

        const color = leafColors[colorIndex % leafColors.length];
        colorIndex++;

        const size = 30 + ((row + col) % 3) * 10;
        const angle = Math.sin(row * 1.3 + col * 0.7) * 1.2;

        this.drawLeaf(ctx, x, y, size, color, angle);
      }
    }
  }

  drawLeaf(ctx, x, y, size, color, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(size * 0.6, -size * 0.5, 0, -size);
    ctx.quadraticCurveTo(-size * 0.6, -size * 0.5, 0, 0);
    ctx.closePath();

    ctx.fillStyle = color;
    ctx.fill();

    ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -size);
    ctx.stroke();

    ctx.restore();
  }
}

registerPaint("leaves-bg", LeavesBackground);
