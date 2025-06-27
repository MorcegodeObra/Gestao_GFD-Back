import { ChartJSNodeCanvas } from 'chartjs-node-canvas';

const width = 250; // px
const height = 250;

const chartCallback = (ChartJS) => {
  // Habilita plugins se quiser
};

const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, chartCallback });

export async function gerarGraficoResumo({ emDia, atrasados }) {
  const configuration = {
    type: 'pie',
    data: {
      labels: ['Processos em Dia', 'Processos Atrasados'],
      datasets: [{
        label: 'Resumo',
        data: [emDia, atrasados],
        backgroundColor: ['#4CAF50', '#F44336'],
      }]
    },
    options: {
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  };

  const image = await chartJSNodeCanvas.renderToDataURL(configuration);
  return image; // base64 format
}
