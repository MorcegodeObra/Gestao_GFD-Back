import cron from "node-cron";
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

      const process = await Process.findAll({
        where: {
          contatoStatus: {
            [Op.notIn]: ["CANCELADO/ARQUIVADO", "CONCLUIDO"],
          },
          userId: {
            [Op.notIn]: [12],
          },
          answer: { [Op.notIn]: true },
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
}

export function iniciarCobranca() {
  servicoCobranca();

  setInterval(servicoCobranca,5 * 60 * 1000);
}
