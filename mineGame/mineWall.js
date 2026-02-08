registerPaint('mine-wall', class {
    static get inputProperties() {
        return ['--depth'];
    }

    paint(ctx, size, props) {
        const w = size.width;
        const h = size.height;

        const depth = parseFloat(props.get('--depth').toString()) || 0;

        // COLOR CHANGE FOR DEPTH
        const t = Math.min(depth / 700, 1);
        const topColor = `rgb(${195 - t * 110}, ${155 - t * 100}, ${110 - t * 80})`;
        const bottomColor = `rgb(${90 - t * 70}, ${65 - t * 55}, ${45 - t * 40})`;

        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, topColor);
        grad.addColorStop(1, bottomColor);

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // MOVE BY DEPTH
        const offsetY = depth * 0.8;

        // BACKGROUND ROCKS
        for (let i = 0; i < 800; i++) {
            const x = Math.random() * w;
            const y = (Math.random() * h + offsetY) % h;
            const r = Math.random() * 6 + 2;

            ctx.beginPath();
            const sides = 6 + Math.floor(Math.random() * 5);
            for (let a = 0; a < sides; a++) {
                const angle = (a / sides) * Math.PI * 2;
                const rx = x + Math.cos(angle) * r * (0.6 + Math.random() * 0.8);
                const ry = y + Math.sin(angle) * r * (0.6 + Math.random() * 0.8);
                if (a === 0) ctx.moveTo(rx, ry);
                else ctx.lineTo(rx, ry);
            }
            ctx.closePath();

            const shade = 40 + Math.random() * 40;
            ctx.fillStyle = `rgba(${shade}, ${shade * 0.8}, ${shade * 0.5}, 0.25)`;
            ctx.fill();
        }
    }
});
