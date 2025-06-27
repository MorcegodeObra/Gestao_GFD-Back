import nodemailer from 'nodemailer';
import { gerarGraficoResumo, gerarGraficoProcessoComUsuario } from './gerarGraficoResumo.js';
import { getWeek } from 'date-fns';

export async function sendResumo(email, emDia, atrasados, criados, modificados, comUsuario, semUsuario) {
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

    const bufferStatus = await gerarGraficoResumo({ emDia, atrasados });
    const bufferUsuario = await gerarGraficoProcessoComUsuario({
      sim: comUsuario,
      nao: semUsuario,
    });

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
      <table width="100%" cellpadding="0" cellspacing="0" style="text-align: center;">
        <tr>
          <td>
            <p>Status dos Processos</p>
            <img src="cid:graficoStatus" style="width: 180px;" />
            <br> Processos em dia: <strong>${emDia}</strong></br>
            <br> Processos em atraso: <strong>${atrasados}</strong></br>

          </td>
          <td>
            <p>Com DER</p>
            <img src="cid:graficoUsuario" style="width: 180px;" />
            <br> Processos com usuário DER: <strong>${comUsuario}</strong></br>
            <br> Processos com Solicitante: <strong>${semUsuario}</strong></br>
          </td>
        </tr>
      </table>

      <hr style="margin: 30px 0;">
      <div style="text-align: center;">
        <img src="https://apismartreport.s3.sa-east-1.amazonaws.com/fotos/LogosEmpresa/icon.png" style="max-width: 150px; margin-bottom: 10px;" />
        <p style="font-size: 14px; color: #666;">"Transformando ideias em sonhos realizados!"</p>
      </div>
    </div>
  `,
      attachments: [
        {
          filename: 'grafico-status.png',
          content: bufferStatus,
          cid: 'graficoStatus',
        },
        {
          filename: 'grafico-usuario.png',
          content: bufferUsuario,
          cid: 'graficoUsuario',
        },
      ],
    };


    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error.message);
  }
}
