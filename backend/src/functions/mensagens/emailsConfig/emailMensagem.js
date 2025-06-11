import nodemailer from 'nodemailer';
import { User } from '../../../models/users.js';
import {ContactEmail} from "../../../models/contactEmail.js"

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

    // 🔥 Buscar o email correto pela área
    const emailsArea = await ContactEmail.findAll({
      where: { contactId: contato.id, area: proces.area }
    });

    const emailDestinos = emailsArea.map(e => e.email);
    if (!emailDestinos.length) {
      console.warn(`⚠️ Nenhum e-mail encontrado para área ${proces.area} no contato ${contato.name}`);
      return; // não envia nada se não houver e-mail correspondente
    }

    const mailOptions = {
      from: `Solicitação - ${proces.processoSider} <${process.env.EMAIL_USER}>`,
      to: emailDestinos.join(","),
      cc: ccList.length > 0 ? ccList : undefined,
      subject: `Solicitação - ${proces.processoSider}`,
      html: `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
      <p>${message.replace(/\n/g, '<br>')}</p>
    </div>
  `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`E-mail enviado para ${emailDestinos} (CC: ${ccList.join(', ') || 'nenhum'}) -> ${info.response}`);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error.message);
  }
}
