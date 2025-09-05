import { handleContact } from "./verificacoes/controladorProcessos.js";
import { Process } from "../../models/processo.js";
import { Op } from "sequelize";

let isRunning = false;

async function servicoCobranca() {
  if (isRunning) {
    console.log("Serviço de envios em andamento");
    return;
  } else {
    console.log("Rodando envio de emails");
    isRunning = true;
    try {
      const now = new Date();
      const diaSemana = now.toLocaleDateString("pt-BR", {
        weekday: "long", // ou 'short'
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const quinzeDias = new Date();
      quinzeDias.setDate(now.getDate() - 15);

      const process = await Process.findAll({
        where: {
          contatoStatus: {
            [Op.notIn]: ["CANCELADO/ARQUIVADO", "CONCLUIDO"],
          },
          userId: {
            [Op.notIn]: [12],
          },
          answer: { [Op.notIn]: true },
          cobrancas: { [Op.lt]: 4 },
          lastInteration: { [Op.lt]: quinzeDias },
        },
      });

      if (diaSemana !== 7 || diaSemana !== 6) {
        console.log("Enviando emails...");
        for (const proces of process) {
          await handleContact(proces, now);
        }
      } else {
        console.log("Final de semana!");
      }
    } catch (err) {
      console.error(
        "Erro ao executar o cron job para envio de mensagens:",
        err
      );
    }
  }
  isRunning = false;
  console.log("Finalizado o envio de emails.");
}

export async function iniciarCobranca() {
  await servicoCobranca();
  setInterval(servicoCobranca, 5 * 60 * 1000);
}
