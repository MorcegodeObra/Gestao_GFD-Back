import nodemailer from 'nodemailer';
import { User } from '../../../models/users.js';

function formatarData(data) {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0'); // Mês em JavaScript é 0-indexed
  const ano = data.getFullYear();

  return `${dia}/${mes}/${ano}`;
}

export async function sendResumo(email, message) {
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

    const mailOptions = {
      from: `"Contato Smart" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Resumo Semanal - ${dataFormatada}`,
      html: `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
      <p>${message.replace(/\n/g, '<br>')}</p>
    </div>
  `,
    };

    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error.message);
  }
}
