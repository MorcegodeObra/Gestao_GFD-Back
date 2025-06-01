import cron from 'node-cron';
import { handleContact } from './verificacoes/controladorContatos.js';
import { sendWeeklySummaries } from './emailsConfig/resumoSemanal.js';
import { Contact } from '../models/contato.js';

export const runCronJob = cron.schedule('* * * * *', async () => {
  console.log("Cron rodando!");
  try {
    const userLogs = {};
    const now = new Date();
    const contacts = await Contact.findAll();

    for (const contact of contacts) {
      await handleContact(contact, now, userLogs);
    }

    await sendWeeklySummaries(userLogs);

  } catch (err) {
    console.error('Erro ao executar o cron job para envio de mensagens:', err);
  }
});
