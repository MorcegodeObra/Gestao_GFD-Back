import { ProcessRepository } from "../domain/repositories/processRepository.js";
import { EmailHandler } from "./emailHandler.js";

export class ServicoCobranca {
  constructor() {
    this.isRunning = false;
    this.processRepo = new ProcessRepository();
    this.emailService = new EmailHandler();
  }
  async executar() {
    if (this.isRunning) {
      console.log("Serviço de envios em andamento");
      return;
    }
    console.log("Rodando envio de emails");
    this.isRunning = true;

    try {
      const now = new Date();
      const diaSemana = now.getDay();

      if (diaSemana === 6 || diaSemana === 0) {
        console.log("Final de semana,não enviaremos email!!");
        return;
      } else {
        console.log("Enviando emails...");

        const processos = await this.processRepo.buscarPendentes();
        for (const proces of processos) {
          await this.emailService.handle(proces, now);
          await this.processRepo.atualizarCobranca(proces, now);
        }
      }
      console.log("Emails Enviados!!");
    } catch (error) {
      console.error("Erro ao executar o serviço de envio de mensagens:", error);
    } finally {
      this.isRunning = false;
    }
  }
}
