import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';

const width = 250; 
const height = 250;

const chartJSNodeCanvas = new ChartJSNodeCanvas({
  width, 
  height,
  plugins: {
    modern: [ChartDataLabels], // registra o plugin
  }
});

const chartCallback = (ChartJS) => {
  // Habilita plugins se quiser
};

export async function gerarGraficoResumo({ emDia, atrasados }) {
  const total = emDia + atrasados;
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
        },
        datalabels: {
          color: '#fff',
          formatter: (value) => {
            const percentage = ((value / total) * 100).toFixed(1);
            return `${percentage}%`;
          },
          font: {
            weight: 'bold',
            size: 14,
          },
        }
      }
    },
    plugins: [ChartDataLabels],
  };

  const image = await chartJSNodeCanvas.renderToBuffer(configuration);
  return image;
}


export async function gerarGraficoProcessoComUsuario({ sim, nao }) {
  const total = sim + nao;
  const configuration = {
    type: 'pie',
    data: {
      labels: ['Sim', 'Não'],
      datasets: [{
        label: 'Processos com DER',
        data: [sim, nao],
        backgroundColor: ['#2196F3', '#9E9E9E'],
      }]
    },
    options: {
      plugins: {
        legend: {
          position: 'bottom',
        },
        datalabels: {
          color: '#fff',
          formatter: (value) => {
            const percentage = ((value / total) * 100).toFixed(1);
            return `${percentage}%`;
          },
          font: {
            weight: 'bold',
            size: 14,
          },
        }
      }
    },
    plugins: [ChartDataLabels],
  };

  const image = await chartJSNodeCanvas.renderToBuffer(configuration);
  return image;
}

