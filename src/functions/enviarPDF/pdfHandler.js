import { RelatorioTecnico } from "./infraestrutura/relatorioTecnico.js";
import { enviarEmail } from "../../config/funcoesEmail.js";
import { unlink } from "fs/promises";

export class ControllerParecer {
  async controladorPDF(user, anuencia, status, fotos) {
    const relatorio = new RelatorioTecnico(user, anuencia, status, fotos);
    const bufferPdf = await relatorio.gerarPdfBuffer();

    const from = `Protocolo - ${anuencia.protocolo} <${process.env.EMAIL_USER}>`;
    const to = user.userEmail;
    const subject = `Relatório de Anuência - ${anuencia.protocolo} - ${status}`;
    const body = `Segue informação sobre a anuência ${anuencia.protocolo},com o status de ${status} conforme verificado in loco.`;
    const cc = [""];
    const attachments = [
      {
        filename: bufferPdf,
        path: bufferPdf,
        contentType: "application/pdf",
      },
    ];
    await enviarEmail(from, to, cc, subject, body, attachments);
    await unlink(bufferPdf)
  }
}
