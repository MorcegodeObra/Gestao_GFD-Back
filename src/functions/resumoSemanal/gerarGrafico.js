import ChartDataLabels from "chartjs-plugin-datalabels";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import { calloutPlugin } from "../../config/pluginGrafico.js";
import { Chart } from "chart.js";
import { text } from "express";

const width = 500;
const height = 250;
const chartJSNodeCanvas = new ChartJSNodeCanvas({
  width,
  height,
  plugins: { modern: [ChartDataLabels] },
});

Chart.register(calloutPlugin);

const PALETA_CORES = [
  "#4CAF50",
  "#F44336",
  "#FF9800",
  "#2196F3",
  "#9C27B0",
  "#FFC107",
  "#009688",
  "#795548",
  "#607D8B",
  "#E91E63",
  "#3F51B5",
];

export async function gerarGraficoGenerico(dados, titulo) {
  let labels = Object.keys(dados);
  let data = Object.values(dados).map((v) => Number(v) || 0); // sempre numérico

  if (labels.length === 0) {
    labels = ["Sem processos"];
    data = [1];
  }

  const colors = labels.map((_, i) => PALETA_CORES[i % PALETA_CORES.length]);
  const total = data.reduce((sum, v) => sum + v, 0);

  Chart.register(calloutPlugin);

  const configuration = {
    type: "pie",
    data: {
      labels,
      datasets: [{ label: titulo, data, backgroundColor: colors }],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: titulo,
          position: "top",
          padding: { bottom: 10 },
          color: "black"
        },
        legend: {
          position: "right",
          labels: {
            generateLabels: (chart) => {
              const dataset = chart.data.datasets[0];
              return chart.data.labels.map((label, i) => {
                const value = dataset.data[i];
                return {
                  text: `${label} (${value})`,
                  fillStyle: dataset.backgroundColor[i],
                  strokeStyle: dataset.borderColor
                    ? dataset.borderColor[i]
                    : "#000",
                };
              });
            },
          },
        },
        datalabels: {
          color: "black",
          formatter: (value, ctx) => {
            const dataset = ctx.chart.data.datasets[0];
            const total = dataset.data.reduce(
              (a, b) => a + (Number(b) || 0),
              0
            );
            if (!total) return "";
            const percentage = ((value / total) * 100).toFixed(1);
            return percentage >= 2 ? `${percentage}%` : ""; // só dentro se ≥ 4%
          },
        },
        calloutLabels: {
          threshold: 4, // porcentagem mínima para puxar para fora
          color: "black",
          fontSize: 12,
        },
      },
    },
  };

  return await chartJSNodeCanvas.renderToBuffer(configuration);
}
