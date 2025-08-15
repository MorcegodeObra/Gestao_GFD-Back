import { Process } from "../models/processo.js"
import { User } from "../models/users.js"
import { DATE, Op } from 'sequelize';

export const criarProcesso = async (req, res) => {
  try {
    const {
      processoSider,
      protocolo,
      area,
      lastSent,
      answerMsg,
      answerDate,
      answer,
      check,
      executed,
      contatoStatus,
      userId,
      contatoId,
      subject,
      priority,
      rodovia,
    } = req.body;
    const user = await User.findByPk(userId)

    const process = await Process.create({
      processoSider,
      protocolo,
      area,
      lastSent,
      answerMsg,
      answerDate,
      lastInteration: lastSent,
      answer,
      check,
      executed,
      contatoStatus,
      userId,
      contatoId,
      subject,
      priority,
      rodovia,
    });

    await user.update({
      criados: (user.criados || 0) + 1
    });

    res.status(201).json(process);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar o Processo. Tente novamente mais tarde.' });
  }
};

export const listarProcesso = async (req, res) => {
  const { userId, notUserId } = req.query;
  let whereClause = {};

  if (userId) {
    whereClause.userId = userId;
  }
  if (notUserId) {
    whereClause.userId = { [Op.ne]: notUserId }; // Sequelize operador "not equal"
  }
  try {
    const processos = await Process.findAll({
      where: whereClause,
      order: [['updatedAt', 'DESC']],
    });
    res.json(processos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const resumoSemanal = async (req, res) => {
  const { userId } = req.params;
  const hoje = new Date();
  const umaSemanaAtras = new Date();
  umaSemanaAtras.setDate(hoje.getDate() - 7);

  try {
    const criados = await Process.findAll({
      where: {
        userId,
        createdAt: { [Op.gte]: umaSemanaAtras }
      }
    });

    const modificados = await Process.findAll({
      where: {
        userId,
        lastInteration: { [Op.gte]: umaSemanaAtras }
      }
    });

    res.json({
      semana: {
        de: umaSemanaAtras.toISOString().split('T')[0],
        ate: hoje.toISOString().split('T')[0]
      },
      criados: {
        total: criados.length,
        lista: criados.map(p => p.processoSider)
      },
      modificados: {
        total: modificados.length,
        lista: modificados.map(p => p.processoSider)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao gerar resumo semanal.' });
  }
}

export const listarIdProcesso = async (req, res) => {
  try {
    const process = await Process.findByPk(req.params.id);
    if (process) {
      res.json(process);
    } else {
      res.status(404).json({ error: 'Processo não encontrado' });
    }
  } catch (error) {
    console.error(error); // Log do erro
    res.status(500).json({ error: 'Erro ao buscar o Processo. Tente novamente mais tarde.' });
  }
};

export const editarProcesso = async (req, res) => {
  try {
    const process = await Process.findByPk(req.params.id);
    if (!process) return res.status(404).json({ error: 'Processo não encontrado' });

    const {
      processoSider,
      protocolo,
      area,
      lastSent,
      answerMsg,
      answer,
      check,
      executed,
      contatoStatus,
      userId,
      contatoId,
      subject,
      priority,
      rodovia,
    } = req.body;

    const donoAtual = process.userId;
    const novoDono = userId;

    // Está tentando mudar o dono
    const mudandoDono = novoDono !== donoAtual;

    if (novoDono !== 12) {
      if (mudandoDono) {
        // Se o dono atual não é o sistema (12), não deixa mudar direto
        if (donoAtual !== 12) {
          // Registra a solicitação de transferência
          await process.update({
            solicitacaoProcesso: true,
            newUserId: novoDono,
          });

          return res.status(202).json({
            message: 'Solicitação de transferência enviada ao dono atual do processo.',
          });
        }
      }
    }
    let answerDate = answer ? new Date() : process.answerDate
    let novoStatus = (!contatoStatus && answer) ? "AGUARDANDO DER" : (contatoStatus || process.contatoStatus);

    const user = await User.findByPk(novoDono)
    await process.update({
      processoSider,
      protocolo,
      area,
      lastSent,
      answerMsg,
      answerDate,
      lastInteration: lastSent,
      answer,
      check,
      executed,
      contatoStatus: novoStatus,
      userId: novoDono,
      contatoId,
      subject,
      priority,
      rodovia,
      solicitacaoProcesso: false,
      newUserId: null,
    });

    if (answer == true){
      process.cobrancas = 0
    }

    if (novoDono !== 12) {
      await user.update({
        editados: (user.editados || 0) + 1
      });
    }

    res.json(process);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao editar o Processo. Tente novamente mais tarde.' });
  }
};



export const deletarProcesso = async (req, res) => {
  try {
    const process = await Process.findByPk(req.params.id);
    if (!process) {
      return res.status(404).json({ error: 'Processo não encontrado' });
    }

    await process.destroy();
    res.json({ message: 'Processo deletado com sucesso' });
  } catch (error) {
    console.error(error); // Log do erro
    res.status(500).json({ error: 'Erro ao deletar o Processo. Tente novamente mais tarde.' });
  }
};

export const aceitarSolicitacao = async (req, res) => {
  try {
    const process = await Process.findByPk(req.params.id);
    if (!process) return res.status(404).json({ error: 'Processo não encontrado' });

    const { userId } = req.body;

    if (!process.solicitacaoProcesso || !process.newUserId) {
      return res.status(400).json({ error: 'Não há solicitação pendente para este processo.' });
    }

    if (process.userId !== userId) {
      return res.status(403).json({ error: 'Você não tem permissão para aprovar esta solicitação.' });
    }

    await process.update({
      userId: process.newUserId,
      solicitacaoProcesso: false,
      newUserId: null
    });

    res.json({ message: 'Solicitação aprovada. Processo transferido com sucesso.', process });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao aprovar a solicitação.' });
  }
};
