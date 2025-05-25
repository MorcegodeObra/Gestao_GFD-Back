import nodemailer from 'nodemailer';

// Função para enviar e-mail via Gmail (com autenticação e configuração detalhada)
export async function sendEmailMessage(contact, message) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',  // Usando o serviço do Gmail
      auth: {
        user: process.env.EMAIL_USER,  // Certifique-se de que o campo é userEmail e não email
        pass: process.env.EMAIL_PASS,   // Certifique-se de que o campo é userCode e não code
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,  // E-mail do remetente
      to: contact.email,  // E-mail do destinatário
      subject: 'Notificação de Solicitação',
      text: message,  // Corpo da mensagem
    };

    // Envio do e-mail
    const info = await transporter.sendMail(mailOptions);
    console.log('E-mail enviado para ' + contact.email + ': ' + info.response);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error.message);
  }
}
