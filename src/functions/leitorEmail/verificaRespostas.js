import { checkEmailReply } from "./checkEmailReply.js";
import { Process } from "../../models/processo.js";
import { Op } from "sequelize";

let isReading = false;

async function verificaEmail() {
  if (isReading) {
    console.log("Serviço de leitura em andamento");
  } else {
    console.log("Verificando emails!");
    isReading = true;
    try {
      const now = new Date();
      const process = await Process.findAll(
        {
          where: {
            contatoStatus: { [Op.notIn]: ["CANCELADO/ARQUIVADO", "CONCLUIDO"] },
            userId: { [Op.notIn]: [12] },
            contatoId: { [Op.not]: [33] },
            answer: { [Op.not]: true },
          }
        }
      );

      for (const proces of process) {
        await checkEmailReply(proces);
      }
    } catch (err) {
      console.error("Erro ao executar a leitura de mensagens:", err);
    }
  }
  isReading = false;
  console.log("Finalizado a leitura de emails!");
}

export async function iniciarVerificaEmail() {
  await verificaEmail();
}
