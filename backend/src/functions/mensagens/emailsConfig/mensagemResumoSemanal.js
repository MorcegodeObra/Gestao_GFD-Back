import nodemailer from 'nodemailer';
import { gerarGraficoResumo } from './gerarGraficoResumo.js';
import { getWeek } from 'date-fns';

export async function sendResumo(email, message, emDia, atrasados, criados , modificados ) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const dataAtual = new Date();
const numeroSemana = getWeek(dataAtual, { weekStartsOn: 0 }); // 0 = domingo, 1 = segunda

    const graficoBase64 = await gerarGraficoResumo({ emDia, atrasados });

    const mailOptions = {
      from: `"Contato Smart" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Resumo Semanal - Semana ${numeroSemana}`,
      html: `
        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
          <h2>📊 Resumo Semanal</h2>

          <p><strong>Atividades Semanais:</strong></p>
          <ul>
            <li>🆕 Processos Criados: <strong>${criados}</strong></li>
            <li>✏️ Processos Modificados: <strong>${modificados}</strong></li>
          </ul>

          <p><strong>Status Geral:</strong></p>
          <img src="${graficoBase64}" alt="Gráfico de resumo" style="max-width: 100%; height: auto;" />

          <hr style="margin: 30px 0;">
          <div style="text-align: center;">
            <img src="https://apismartreport.s3.sa-east-1.amazonaws.com/fotos/LogosEmpresa/icon.png" style="max-width: 150px; margin-bottom: 10px;" />
            <p style="font-size: 14px; color: #666;">"Transformando ideias em sonhos realizados!"</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error.message);
  }
}
