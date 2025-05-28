import nodemailer from 'nodemailer';
import { User } from '../models/user.js';  // Importa o modelo de User

export async function sendEmailMessage(contact, message) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 🔥 Buscar o usuário que modificou por último, se houver
    let ccEmail = null;
    if (contact.lastUserModified) {
      const user = await User.findByPk(contact.lastUserModified);
      if (user && user.userEmail) {
        ccEmail = user.userEmail;
      }
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: contact.email,  // Destinatário principal
      cc: ccEmail ?? undefined,  // 🔥 CC apenas se existir
      subject: 'Notificação de Solicitação',
      text: message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`E-mail enviado para ${contact.email} (CC: ${ccEmail ?? 'nenhum'}) -> ${info.response}`);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error.message);
  }
}
