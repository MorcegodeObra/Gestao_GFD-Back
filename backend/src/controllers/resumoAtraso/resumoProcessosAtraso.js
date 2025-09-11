import { Op } from "sequelize";
import { subDays } from "date-fns";
import { Process } from "../../models/processo.js";
import { User } from "../../models/users.js";
import { enviarResumoAtraso } from "./envioEmailAtrasos.js";
import { gerarMensagemHTMLMultiplosProcessos } from "./gerarHTMlResumoProcessosAtraso.js";

export const resumoProcessosAtraso = async (req, res) => {
  try {
    const user = await User.findByPk(req.body.userId);
    const processos = await Process.findAll({
      where: {
        lastInteration: { [Op.lt]: subDays(new Date(), 30) },
        contatoStatus: { [Op.notIn]: ["CANCELADO/ARQUIVADO", "CONCLUIDO"] },
        userId: { [Op.eq]: req.body.userId },
        contatoId: { [Op.ne]: 33 },
        ano: { [Op.in]: req.body.anos },
        cobrancas: { [Op.gte]: 2 },
      },
    });
    const titulo = "⚠️ Processos em atraso";
    const corpo = `
      Verificamos que o prazo de <strong>30 dias</strong> de alguns processos já expirou.<br><br>
      Sugere o arquivamento do processo pois conforme disposto no Decreto 140/2015, 
      o não envio dentro do prazo de 30 dias sujeita o interessado ao pagamento de nova taxa de vistoria e análise de projeto.<br>
      Caso haja alguma atualização do processo e não foi atualizada,sugerimos a atulização apra que não haja o arquivamento errôneo.
      `;

    const mensagem = await gerarMensagemHTMLMultiplosProcessos(
      processos,
      titulo,
      corpo,
      user
    );
    const resumo = await enviarResumoAtraso(mensagem, user);
    res.status(201).json(resumo);
  } catch (e) {
    console.log(`Ocorreu o seguinte erro: ${e}`);
  }
};
