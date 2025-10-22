import { enviarEmail } from "../../../config/funcoesEmail.js";

export class EmailSender {
  async send(message) {
    try {
      await enviarEmail(
        message.from,
        message.to,
        message.cc,
        message.subject,
        message.html
      );
      console.log(`📤 Email enviado para ${message.to} (CC: ${message.cc || "nenhum"})`);
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error.message);
    }
  }
}
