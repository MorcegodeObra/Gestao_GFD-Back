import { Sequelize } from 'sequelize';
import { Contact } from '../models/contato.js';
import cron from 'node-cron';
import { configDotenv } from 'dotenv';
import { sendWhatsAppMessage } from './whatsMensagem.js';  // Importando função WhatsApp
import { sendEmailMessage } from './emailMensagem.js';  // Importando função de E-mail

// Mapeamento de prioridades para dias
const priorityDays = {
  'BAIXO': 5,
  'MÉDIO': 3,
  'ALTO': 2,
  'URGENTE': 1,
};

configDotenv();

// Função para o cron job
export const runCronJob = cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    // Buscando contatos que não responderam e que precisam de mensagens baseadas na prioridade e na data do último envio
    const contacts = await Contact.findAll({
      where: {
        answer: false, // Só considerar contatos que não responderam
      },
    });

    for (const contact of contacts) {
      const lastSent = contact.lastSent ? new Date(contact.lastSent) : null;

      if (!lastSent) {
        console.log(`Contato ${contact.name} não tem data de envio. Nenhuma mensagem será enviada.`);
        continue; // Se não houver `lastSent`, pula para o próximo contato
      }

      // Verificando se já respondeu
      if (contact.answer === true) {
        // Notificar que a solicitação foi respondida
        const notificationMessage = `A solicitação de ${contact.name} foi respondida no número ${contact.number}.`;
        sendWhatsAppMessage(contact.number, notificationMessage);
        sendEmailMessage(contact, notificationMessage); // Enviar via E-mail
        continue;  // Pula para o próximo contato, pois ele já foi respondido
      }

      // Calculando a diferença de dias entre a data atual e a última data de envio
      const diffInTime = now - lastSent;
      const diffInDays = diffInTime / (1000 * 3600 * 24); // Convertendo para dias

      const priority = contact.priority || 'BAIXO'; // Se não houver prioridade, assume 'BAIXO'
      const daysAllowed = priorityDays[priority];

      if (diffInDays >= daysAllowed) {
        // Se a diferença de dias for maior ou igual ao permitido pela prioridade, envia a mensagem
        console.log(`Enviando mensagem para ${contact.name} (Prioridade: ${priority})`);
        await sendWhatsAppMessage(contact.number, `Mensagem enviada para ${contact.name} - ${contact.subject}`); // Envia via WhatsApp
        sendEmailMessage(contact, `Mensagem enviada para ${contact.name} - ${contact.subject}`); // Envia via E-mail

        // Após enviar, atualiza o campo `answer` para true
        contact.answer = true;  // Marcar como respondido
        await contact.save();
      } else {
        console.log(`Contato ${contact.name} está dentro do limite de tempo para prioridade ${priority}. Nenhuma mensagem enviada.`);
      }

      // Verificando se o contato não respondeu após 30 dias
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(now.getDate() - 30);  // Data de 30 dias atrás

      if (lastSent <= thirtyDaysAgo && contact.answer === false) {
        // Se já passaram 30 dias e o contato ainda não respondeu, enviar uma mensagem notificando isso
        const noResponseMessage = `Não houve resposta do contato ${contact.name} no número ${contact.number} após 30 dias.`;
        sendWhatsAppMessage(contact.number, noResponseMessage); // Envia via WhatsApp
        sendEmailMessage(contact, noResponseMessage); // Envia via E-mail
      }

    }

  } catch (err) {
    console.error('Erro ao executar o cron job para envio de mensagens:', err);
  }
});
