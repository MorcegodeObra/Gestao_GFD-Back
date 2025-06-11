import cron from 'node-cron';
import { handleContact } from './verificacoes/controladorProcessos.js';
import { Process } from '../../models/processo.js';

export const servicoCobranca = cron.schedule('*/10 * * * *', async () => {
  console.log("Mandando Emails!");
  try {
    const now = new Date();
    const process = await Process.findAll();

    for (const proces of process) {
      await handleContact(proces, now);
    }

  } catch (err) {
    console.error('Erro ao executar o cron job para envio de mensagens:', err);
  }
});
