function rand(seed) {
  const x = Math.sin(seed * 1000) * 10000;
  return x - Math.floor(x);
}

class Snowfall {
  static get inputProperties() {
    return ['--time'];
  }

  paint(ctx, size, props) {
    const t = parseFloat(props.get('--time')) || 0;
    const { width, height } = size;

    const SNOW_COUNT = 150;
    const MIN_R = 2;
    const MAX_R = 5;
    const FALL_SPEED = 1.2;
    const SWAY = 20;
    const WIND_SPEED = 0.5;

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < SNOW_COUNT; i++) {
      const r = MIN_R + rand(i) * (MAX_R - MIN_R);

      const startX = rand(i * 2) * width;

      const startHeight = rand(i * 3);

      const x = (startX + Math.sin(t * 0.05 + i) * SWAY + t * WIND_SPEED) % width;
      const y = (t * FALL_SPEED + startHeight * height) % height;

      ctx.fillStyle = `rgba(255, 255, 255, 0.5)`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
}

registerPaint('snowfall', Snowfall);
