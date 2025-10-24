import { transporter } from "../../config/funcoesEmail.js";
import { Process } from "../../models/processo.js";
import { getWeek } from "date-fns";

import { gerarGraficoGenerico } from "./gerarGrafico.js";

export async function sendResumo(
  email,
  emDia,
  atrasados,
  criados,
  modificados,
  comUsuario,
  comSolicitante
) {
  try {
    // Busca todos os processos e conta eles
    const processos = await Process.findAll();
    const statusCount = {};
    processos.forEach((p) => {
      const status = p.contatoStatus || "SEM STATUS";
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    // Gera gráficos
    const dadosUsuario = {
      "Com Usuário": comUsuario,
      "Com Solicitante": comSolicitante,
    };
    const bufferUsuario = await gerarGraficoGenerico(
      dadosUsuario,
      "Processos com Usuário"
    );
    const dadosPrazo = { "Em Dia": emDia, Atrasados: atrasados };
    const bufferPrazo = await gerarGraficoGenerico(
      dadosPrazo,
      "Resumo de Prazos"
    );
    const bufferStatus = await gerarGraficoGenerico(
      statusCount,
      "Processos por Status"
    );

    const dataAtual = new Date();
    const numeroSemana = getWeek(dataAtual, { weekStartsOn: 0 });

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
      <table width="100%" cellpadding="0" cellspacing="0" style="text-align: center; table-layout: fixed;">
        <tr>
          <td style="width: 50%; vertical-align: top; padding: 5px;">
            <img src="cid:graficoStatus" style="width: 100%; height: auto; max-width: 500px;" />
          </td>
          <td style="width: 50%; vertical-align: top; padding: 5px;">
            <img src="cid:graficoPrazo" style="width: 100%; height: auto; max-width: 500px;" />
          </td>
          <td style="width: 50%; vertical-align: top; padding: 5px;">
            <img src="cid:graficoUsuario" style="width: 100%; height: auto; max-width: 500px;" />
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
          filename: "grafico-status.png",
          content: bufferStatus,
          cid: "graficoStatus",
        },
        {
          filename: "grafico-usuario.png",
          content: bufferUsuario,
          cid: "graficoUsuario",
        },
        {
          filename: "grafico-prazo.png",
          content: bufferPrazo,
          cid: "graficoPrazo",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
  }
}
