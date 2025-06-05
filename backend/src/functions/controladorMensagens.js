import cron from 'node-cron';
import { handleContact } from './verificacoes/controladorProcessos.js';
import { sendWeeklySummaries } from './emailsConfig/resumoSemanal.js';
import { Process } from '../models/processo.js';

export const runCronJob = cron.schedule('* * * * *', async () => {
  console.log("Cron rodando!");
  try {
    const userLogs = {};
    const now = new Date();
    const process = await Process.findAll();

    for (const proces of process) {
      await handleContact(proces, now, userLogs);
    }

    await sendWeeklySummaries(userLogs);

  } catch (err) {
    console.error('Erro ao executar o cron job para envio de mensagens:', err);
  }
});
