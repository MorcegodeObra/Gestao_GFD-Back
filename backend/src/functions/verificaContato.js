import { Sequelize } from 'sequelize';
import { Contact } from '../models/contato.js';
import cron from 'node-cron';
import { configDotenv } from 'dotenv';
import { sendWhatsAppMessage } from './whatsMensagem.js';
import { sendEmailMessage } from './emailMensagem.js';

const priorityDays = {
  'BAIXO': 5,
  'MÉDIO': 3,
  'ALTO': 2,
  'URGENTE': 1,
};

configDotenv();

export const runCronJob = cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();

    const contacts = await Contact.findAll({
      where: {
        answer: false,
      },
    });

    for (const contact of contacts) {
      const lastSent = contact.lastSent ? new Date(contact.lastSent) : null;

      if (!lastSent) {
        console.log(`Contato ${contact.name} não tem data de envio. Nenhuma mensagem será enviada.`);
        continue;
      }

      // Verificando se já respondeu
      if (contact.answer === true) {
        const notificationMessage = `A solicitação de ${contact.name} foi respondida no número ${contact.number}.`;
        await sendWhatsAppMessage(contact.number, notificationMessage);
        await sendEmailMessage(contact, notificationMessage);
        continue;
      }

      const diffInTime = now - lastSent;
      const diffInDays = diffInTime / (1000 * 3600 * 24);

      const priority = contact.priority || 'BAIXO';
      const daysAllowed = priorityDays[priority];

      if (diffInDays >= daysAllowed) {
        console.log(`Enviando mensagem para ${contact.name} (Prioridade: ${priority})`);

        await sendWhatsAppMessage(contact.number, `Mensagem enviada para ${contact.name} - ${contact.subject}`);
        await sendEmailMessage(contact, `Mensagem enviada para ${contact.name} - ${contact.subject}`);

        // 🔥 Atualiza lastSent com data atual e mantém answer como está
        contact.lastSent = now;
        await contact.save();
      } else {
        console.log(`Contato ${contact.name} está dentro do limite de tempo para prioridade ${priority}. Nenhuma mensagem enviada.`);
      }

      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(now.getDate() - 30);

      if (lastSent <= thirtyDaysAgo && contact.answer === false) {
        const noResponseMessage = `Não houve resposta do contato ${contact.name} no número ${contact.number} após 30 dias.`;

        await sendWhatsAppMessage(contact.number, noResponseMessage);
        await sendEmailMessage(contact, noResponseMessage);

        // 🔥 Atualiza também lastSent para registrar o envio após 30 dias
        contact.lastSent = now;
        await contact.save();
      }
    }

  } catch (err) {
    console.error('Erro ao executar o cron job para envio de mensagens:', err);
  }
});