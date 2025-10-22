import { Process } from "../../../../models/processo.js";
import { Op } from "sequelize";

export class ProcessRepository {
  async buscarPendentes() {
    const now = new Date();

    const quinzeDias = new Date();
    quinzeDias.setDate(now.getDate() - 15);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const trintaDias = new Date();
    trintaDias.setDate(now.getDate() - 30);

    const tresDias = new Date();
    tresDias.setDate(now.getDate() - 3);

    return Process.findAll({
      where: {
        contatoStatus: { [Op.notIn]: ["CANCELADO/ARQUIVADO", "CONCLUIDO"] },
        userId: { [Op.notIn]: [12] },
        answer: { [Op.not]: true },
        cobrancas: { [Op.lt]: 6 },
        [Op.or]: [
          {
            lastInteration: { [Op.lte]: quinzeDias },
            lastSent: { [Op.lt]: startOfToday },
          },
          {
            lastInteration: { [Op.lt]: trintaDias },
            lastSent: { [Op.lte]: tresDias },
          },
        ],
      },
    });
  }

  async atualizarCobranca(proces, now) {
    const lastInteration = proces.lastInteration
      ? new Date(proces.lastInteration)
      : null;

    const diffDays = lastInteration
      ? Math.floor((now - lastInteration) / (1000 * 60 * 60 * 24))
      : Infinity;

    if (diffDays >= 30) {
      proces.cobrancas = (proces.cobrancas || 0) + 1;
    }
    proces.lastSent = now;
    await proces.save();
    console.log(`Processo ${proces.processoSider} atualizado!!`);
    return proces;
  }
}
