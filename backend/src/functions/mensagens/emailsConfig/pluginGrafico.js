export const calloutPlugin = {
  id: "calloutLabels",
  afterDraw(chart, args, options) {
    const { ctx } = chart;
    const meta = chart.getDatasetMeta(0);

    if (!meta || !meta.data) return;

    const dataset = chart.data.datasets[0];
    const total = dataset.data.reduce((a, b) => a + (Number(b) || 0), 0);

    meta.data.forEach((arc, i) => {
      const value = dataset.data[i];
      const perc = ((value / total) * 100).toFixed(1);

      if (perc < options.threshold) {
        const { x: cx, y: cy } = arc.getProps(['x', 'y'], true); // centro do chart
        const radius = arc.outerRadius;
        const startAngle = arc.startAngle;
        const endAngle = arc.endAngle;
        const angle = (startAngle + endAngle) / 2;

        // ponto inicial (borda da fatia)
        const startX = cx + Math.cos(angle) * (radius * 0.7);
        const startY = cy + Math.sin(angle) * (radius * 0.7);

        // ponto final (fora da pizza)
        const endX = cx + Math.cos(angle) * (radius + 20);
        const endY = cy + Math.sin(angle) * (radius + 20);

        ctx.save();

        // ---- linha principal ----
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = options.color || "black";
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // ---- seta ----
        const arrowSize = 6;
        const angleArrow = Math.atan2(endY - startY, endX - startX);
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - arrowSize * Math.cos(angleArrow - Math.PI / 6),
          endY - arrowSize * Math.sin(angleArrow - Math.PI / 6)
        );
        ctx.lineTo(
          endX - arrowSize * Math.cos(angleArrow + Math.PI / 6),
          endY - arrowSize * Math.sin(angleArrow + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fillStyle = options.color || "black";
        ctx.fill();

        // ---- texto ----
        ctx.font = `${options.fontSize || 12}px sans-serif`;
        ctx.fillStyle = options.color || "black";
        ctx.textAlign = endX < cx ? "right" : "left";
        ctx.textBaseline = "middle";

        const label = chart.data.labels[i];
        ctx.fillText(
          `${label}: ${value} (${perc}%)`,
          endX + (endX < cx ? -8 : 8),
          endY
        );

        ctx.restore();
      }
    });
  },
};
