import { Process } from "../models/processo.js"
import { Op } from 'sequelize';

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
      contatoStatus,
      userId,
      contatoId,
      subject,
      priority,
      rodovia,
    });

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
