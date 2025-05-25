import axios from 'axios';

// Função para enviar mensagem via WhatsApp usando Z-API
export function sendWhatsAppMessage(phoneNumber, message) {
  const url = `https://api.z-api.io/instances/${process.env.instanceID}/token/${process.env.token}/send-text`;

  axios.post(url, {
    phone: phoneNumber,
    message: message,  // A mensagem que será enviada
  }, {
    headers: {
      'Client-Token': process.env.Client_Token,  // Autenticação do cliente
    },
  })
  .then(response => {
    console.log(`Mensagem via WhatsApp enviada para ${phoneNumber}:`, response.data);
  })
  .catch(err => {
    console.error('Erro ao enviar mensagem via WhatsApp (Z-API):', err.message);
  });
}
