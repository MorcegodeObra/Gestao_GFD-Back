import cron from 'node-cron';
import { handleContact } from './verificacoes/controladorProcessos.js';
import { Process } from '../../models/processo.js';
import { Op } from 'sequelize';

export const servicoCobranca = cron.schedule('*/15 * * * *', async () => {
  try {
    const now = new Date();
    const diaSemana = new Date().toLocaleDateString('pt-BR', { weekday: 'numeric', timeZone: 'America/Sao_Paulo' });
    const process = await Process.findAll({
      where: {
        contatoStatus: {
          [Op.notIn]: ["CANCELADO/ARQUIVADO", "CONCLUIDO"]
        },
        userId: {
          [Op.notIn]: [12]
        },
        answer: { [Op.notIn]: true }
      }
    });

    if (diaSemana !== 7 || diaSemana !== 6) {
      console.log("Enviando emails...")
      for (const proces of process) {
        await handleContact(proces, now);
      }
    } else {
      console.log("Final de semana!")
    }
  } catch (err) {
    console.error('Erro ao executar o cron job para envio de mensagens:', err);
  }
});
