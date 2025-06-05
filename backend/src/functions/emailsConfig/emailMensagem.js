import nodemailer from 'nodemailer';
import { User } from '../../models/users.js';

function formatarData(data) {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0'); // Mês em JavaScript é 0-indexed
  const ano = data.getFullYear();

  return `${dia}/${mes}/${ano}`;
}

export async function sendEmailMessage(proces, message, contato) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const dataAtual = new Date();
    const dataFormatada = formatarData(dataAtual);

    let ccList = [];

    // 📌 1. Adicionar quem modificou por último (userId)
    if (proces.userId) {
      const user = await User.findByPk(proces.userId);
      if (user?.userEmail) {
        ccList.push(user.userEmail);
      }
    }

    // 📌 2. Adicionar coordenador da área, se diferente do anterior
    if (proces.area && proces.area !== 'SEM AREA') {
      const coordenadores = await User.findAll({
        where: {
          userCargo: 'COORDENADOR',
          userArea: proces.area,
        },
      });

      for (const coord of coordenadores) {
        if (coord.userEmail && !ccList.includes(coord.userEmail)) {
          ccList.push(coord.userEmail);
        }
      }
    }

    const mailOptions = {
      from: `Solicitação - ${proces.processoSider} <${process.env.EMAIL_USER}>`,
      to: contato.email,
      cc: ccList.length > 0 ? ccList : undefined,
      subject: `Solicitação - ${proces.processoSider}`,
      html: `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
      <p>${message.replace(/\n/g, '<br>')}</p>
    </div>
  `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`E-mail enviado para ${contato.email} (CC: ${ccList.join(', ') || 'nenhum'}) -> ${info.response}`);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error.message);
  }
}
