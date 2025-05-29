// testeEmail.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function enviarEmailTeste() {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // ou use host/port se quiser mais controle
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Teste de Envio" <${process.env.EMAIL_USER}>`,
      to: 'destinatario@email.com', // coloque o e-mail de destino aqui
      subject: '🔧 Teste de Envio via Gmail com Nodemailer',
      text: 'Olá! Este é um e-mail de teste enviado pelo seu sistema usando Gmail.',
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ E-mail enviado com sucesso:', info.response);
  } catch (err) {
    console.error('❌ Erro ao enviar e-mail:', err.message);
  }
}

enviarEmailTeste();
