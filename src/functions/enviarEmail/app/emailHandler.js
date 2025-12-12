import { sendEmailMessage } from "../infrastructure/email/sendEmailMessage.js";
import { sendWhatsAppMessage } from "../infrastructure/whatsapp/whatsMensagem.js";
import { ContactRepository } from "../domain/repositories/contactRepository.js";
import { MensagemPrazoVencido } from "../domain/strategies/messageVencido.js";
import { MensagemAcompanhamento } from "../domain/strategies/messageEmDia.js";
import { EmailHTMLBuilder } from "../domain/services/gerarMensagemService.js";

export class EmailHandler {
  constructor() {
    this.contactRepo = new ContactRepository();
    this.strategies = [
      new MensagemAcompanhamento(),
      new MensagemPrazoVencido(),
    ];
    this.emailHTMLBuilder = new EmailHTMLBuilder();
  }

  async handle(processo, now) {
    const contato = await this.contactRepo.buscarPorId(processo.contatoId);
    for (const strategy of this.strategies) {
      if (strategy.deveEnviar(processo, now)) {
        const titulo = strategy.getTitulo();
        const corpo = strategy.getCorpo(processo, contato, now);
        const mensagem = await this.emailHTMLBuilder.construirMensagem(
          processo,
          contato,
          titulo,
          corpo
        );
        await sendEmailMessage(processo, now, mensagem, contato);
        //await sendWhatsAppMessage(processo, now, mensagem, contato);
        return;
      }
    }
  }
}
