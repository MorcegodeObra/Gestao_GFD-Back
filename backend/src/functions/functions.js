import axios from 'axios';

function generateMessage(name, subject) {
  return `Olá ${name}, tudo bem? Como ficou ${subject || 'o último assunto discutido'}?`;
}

export async function sendText(contacts) {
  for (const contact of contacts) {
    const message = generateMessage(contact.name, contact.subject || 'tópico não informado');
    const url = `https://api.z-api.io/instances/${process.env.instanceID}/token/${process.env.token}/send-text`;

    console.log(`Enviando para ${contact.name} - ${contact.number}`);
    try {
      const response = await axios.post(url, {
        phone: contact.number,
        message,
      }, {
        headers: {
          'Client-Token': process.env.Client_Token,
        },
      });

      console.log(`Resposta da API para ${contact.name}:`, response.data);

      contact.lastSent = new Date(); // Atualizando o campo `lastSent` com a data atual
      await contact.save();
      console.log(`Mensagem enviada para ${contact.name}`);
    } catch (err) {
      console.error(`Erro ao enviar para ${contact.name}:`, err.message);
    }
  }

  console.log('Envio de mensagens finalizado.');
}
