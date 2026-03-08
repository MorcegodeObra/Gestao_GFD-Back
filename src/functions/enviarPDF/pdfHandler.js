import { enviarEmail } from "../../config/funcoesEmail.js";
import { unlink } from "fs/promises";
import { gerarDocx, converterPDF } from "./infraestrutura/relatorioTecnico.js";

export class ControllerParecer {
  async controladorPDF(anuencia, user, sreDer) {
    const bufferDOC = await gerarDocx(anuencia, sreDer);
    const bufferPdf = await converterPDF(bufferDOC,anuencia.informacao);

    const from = `Protocolo - ${anuencia.protocolo} <${process.env.EMAIL_USER}>`;
    const to = user.userEmail;
    const subject = `Relatório de Anuência - ${anuencia.protocolo}`;
    const body = `Segue informação sobre a anuência ${anuencia.protocolo},com o status de conforme verificado in loco.`;
    const cc = [""];
    const attachments = [
      {
        filename: bufferPdf,
        path: bufferPdf,
        contentType: "application/pdf",
      },
    ];
    await enviarEmail(from, to, cc, subject, body, attachments);
    await unlink(bufferPdf);
    await unlink(bufferDOC);
  }
}
