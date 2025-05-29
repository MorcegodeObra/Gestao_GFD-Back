import nodemailer from 'nodemailer';
import { User } from '../../models/users.js'; // Ajuste o caminho se necessário

export async function sendEmailMessage(contact, message) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });


    let ccList = [];

    // 📌 1. Adicionar quem modificou por último (lastUserModified)
    if (contact.lastUserModified) {
      const user = await User.findByPk(contact.lastUserModified);
      if (user?.userEmail) {
        ccList.push(user.userEmail);
      }
    }

    // 📌 2. Adicionar coordenador da área, se diferente do anterior
    if (contact.area && contact.area !== 'SEM AREA') {
      const coordenadores = await User.findAll({
        where: {
          userCargo: 'COORDENADOR',
          userArea: contact.area,
        },
      });

      for (const coord of coordenadores) {
        if (coord.userEmail && !ccList.includes(coord.userEmail)) {
          ccList.push(coord.userEmail);
        }
      }
    }

    const mailOptions = {
      from: `"Contato Smart" <${process.env.EMAIL_USER}>`,
      to: contact.email,
      cc: ccList.length > 0 ? ccList : undefined,
      subject: 'Notificação de Solicitação',
      text: message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`E-mail enviado para ${contact.email} (CC: ${ccList.join(', ') || 'nenhum'}) -> ${info.response}`);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error.message);
  }
}
