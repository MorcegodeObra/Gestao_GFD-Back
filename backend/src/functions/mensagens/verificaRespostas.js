import cron from 'node-cron';
import { checkEmailReply } from './verificacoes/checkEmailReply.js';
import { Process } from '../../models/processo.js';

export const verificaEmail = cron.schedule('*/5 * * * *', async () => {
  console.log("Verificando emails!");
  try {
    const now = new Date();
    const process = await Process.findAll();

    for (const proces of process) {
      const emailRespondido = await checkEmailReply(proces);
      if (emailRespondido || proces.answer == true) {
        proces.answer = true;
        proces.lastInteration = now;
        await proces.save();
      }
    }

  } catch (err) {
    console.error('Erro ao executar a leitura de mensagens:', err);
  }
});
