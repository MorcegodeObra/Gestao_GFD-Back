import cron from "node-cron";
import { checkEmailReply } from "./verificacoes/checkEmailReply.js";
import { Process } from "../../models/processo.js";
import { set } from "date-fns";

let isReading = false;

async function verificaEmail() {
  if (isReading) {
    console.log("Serviço de leitura em andamento");
  } else {
    console.log("Verificando emails!");
    isReading = true;
    try {
      const now = new Date();
      const process = await Process.findAll();

      for (const proces of process) {
        const emailRespondido = await checkEmailReply(proces);
        if (emailRespondido || proces.answer == true) {
          proces.answer = true;
          proces.processoComDER = true;
          proces.lastInteration = now;
          proces.cobrancas = 0;
          await proces.save();
        }
      }
    } catch (err) {
      console.error("Erro ao executar a leitura de mensagens:", err);
    }
  }
  isReading = false;
  console.log("Finalizado a leitura de emails!");
}

export function iniciarVerificaEmail() {
  verificaEmail();

  setInterval(verificaEmail, 5 * 60 * 1000);
}
