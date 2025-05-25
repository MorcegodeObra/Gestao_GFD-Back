import { sendWhatsAppMessage } from './src/functions/whatsMensagem.js'; // Importando a função WhatsApp
import { sendEmailMessage } from './src/functions/emailMensagem.js'; // Importando a função E-mail
import { sendText } from './src/functions/functions.js'; // Função de envio de texto (via Z-API)
import { configDotenv } from 'dotenv';
dotenv.config();

// Função para enviar notificações via WhatsApp e E-mail
export function sendNotification(contact, message) {
  // Enviar via WhatsApp (Z-API)
  sendWhatsAppMessage(contact.phone_number, message, 1);

  // Enviar por E-mail
  sendEmailMessage(contact, message, 1);
}

// Dados de teste com contatos
const testContacts = [
  {
    name: "Contato 1",
    answer: false,
    lastSent: new Date(Date.now() - 1000 * 3600 * 24 * 31), // 31 dias atrás
    priority: 'ALTO',
    phone_number: '42999802966',
    email: 'contato1@example.com',  // E-mail para notificações
  },
  {
    name: "Contato 2",
    answer: true,
    lastSent: new Date(Date.now() - 1000 * 3600 * 24 * 10), // 10 dias atrás
    priority: 'BAIXO',
    phone_number: '42999802966',
    email: 'contato2@example.com',  // E-mail para notificações
  },
];

const runTest = async () => {
  for (const contact of testContacts) {
    const lastSent = contact.lastSent ? new Date(contact.lastSent) : null;

    // Verificando se já respondeu
    if (contact.answer === true) {
      const notificationMessage = `A solicitação de ${contact.name} foi respondida no número ${contact.phone_number}.`;
      console.log(`Notificando: ${contact.name} - Solicitação respondida.`);
      sendNotification(contact, notificationMessage); // Envia a notificação para WhatsApp e E-mail
      continue;
    }

    // Calculando a diferença de dias entre a data atual e a última data de envio
    const diffInTime = new Date() - lastSent;
    const diffInDays = diffInTime / (1000 * 3600 * 24); // Convertendo para dias

    // Se já se passaram mais de 30 dias sem resposta
    if (diffInDays >= 30) {
      const noResponseMessage = `Não houve resposta do contato ${contact.name} no número ${contact.phone_number} após 30 dias.`;
      console.log(`Notificando: ${contact.name} - Não houve resposta após 30 dias.`);
      sendNotification(contact, noResponseMessage); // Envia a notificação para WhatsApp e E-mail
    } else {
      // Caso contrário, envia a mensagem baseada na prioridade
      const message = `Mensagem enviada para ${contact.name} - Prioridade: ${contact.priority}`;
      console.log(`Enviando mensagem para ${contact.name} (Prioridade: ${contact.priority})`);
      await sendText([contact]); // Envia a mensagem via Z-API para WhatsApp
      sendNotification(contact, message); // Envia a notificação por E-mail e WhatsApp
    }
  }
};

// Executando o teste
runTest();
