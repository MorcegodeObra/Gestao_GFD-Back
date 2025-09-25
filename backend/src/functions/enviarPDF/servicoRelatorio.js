import { User } from "../../models/users.js";
import { Process } from "../../models/processo.js";
import { gerarPdfBuffer } from "./estruturaPDF.js";
import { enviarEmail } from "../../config/funcoesEmail.js";

// Função principal que monta o PDF e envia
export async function enviarRelatorio(req, res) {
  try {
    const { userId, processId } = req.body;
    // Buscar usuário e processo
    const user = await User.findByPk(userId);
    const process = await Process.findOne({ where: { id: processId } });

    if (!user || !process) {
      throw new Error("Usuário ou processo não encontrado");
    }
    const pdfBuffer = await gerarPdfBuffer(user, process);
    // Enviar email para o usuário
    const from = `Relatório Gerado - ${process.env.EMAIL_USER}`;
    const to = user.userEmail;
    const subject = `Relatório Técnico - Processo ${process.id}`;
    const body = `Segue em anexo o relatório técnico do processo ${processId}.`;
    const attachments = [
      {
        filename: `relatorio-processo-${processId}.pdf`,
        content: pdfBuffer,
      },
    ];
    await enviarEmail(from, to, subject, body, attachments);
    res.json({ sucess: true, message: "Relatório enviado por email!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao enviar relatório" });
  }
}
