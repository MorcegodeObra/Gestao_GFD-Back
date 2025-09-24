import { Anuencia } from "../models/protocoloAnuencia.js";
import { User } from "../models/users.js";
import { DATE, Op } from "sequelize";

export const novaAnuencia = async (req, res) => {
  try {
    const {
      protocolo,
      area,
      tipoAnuencia,
      dataFinal,
      rodovia,
      ultimaInteracao,
      respondido,
      protocoloStatus,
      userId,
      contatoId,
      mensagemParaEnvio,
      prioridade,
      ano,
    } = req.body;
    const user = await User.findByPk(userId);

    const criarProtocolo = await Anuencia.create({
      protocolo,
      area,
      tipoAnuencia,
      dataFinal,
      rodovia,
      ultimaInteracao,
      respondido,
      protocoloStatus,
      userId,
      contatoId,
      mensagemParaEnvio,
      prioridade,
      ano,
    });

    await user.update({
      criados: (user.criados || 0) + 1,
    });

    res.status(201).json(criarProtocolo);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Erro ao criar o Protocolo. Tente novamente mais tarde.",
    });
  }
};

export const listarAnuencias = async (req, res) => {
  const { userId, notUserId } = req.query;
  let whereClause = {};

  if (userId) {
    whereClause.userId = userId;
  }
  if (notUserId) {
    whereClause.userId = { [Op.ne]: notUserId }; // Sequelize operador "not equal"
  }
  try {
    const protocolos = await Anuencia.findAll({
      where: whereClause,
      order: [["updatedAt", "DESC"]],
    });
    res.json(protocolos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listarIdAnuencias = async (req, res) => {
  try {
    const protocolo = await Anuencia.findByPk(req.params.id);
    if (protocolo) {
      res.json(protocolo);
    } else {
      res.status(404).json({ error: "Protocolo não encontrado" });
    }
  } catch (error) {
    console.error(error); // Log do erro
    res.status(500).json({
      error: "Erro ao buscar o Protocolo. Tente novamente mais tarde.",
    });
  }
};

export const editarAnuencia = async (req, res) => {
  try {
    const edicaoProtocolo = await Anuencia.findByPk(req.params.id);
    if (!edicaoProtocolo)
      return res.status(404).json({ error: "Protocolo não encontrado" });

    const {
      protocolo,
      area,
      tipoAnuencia,
      dataFinal,
      rodovia,
      ultimaInteracao,
      respondido,
      protocoloStatus,
      userId,
      contatoId,
      mensagemParaEnvio,
      prioridade,
      solicitacaoProtocolo,
      newUserId,
      ano,
    } = req.body;

    const donoAtual = edicaoProtocolo.userId;
    const novoDono = userId;

    // Está tentando mudar o dono
    const mudandoDono = novoDono !== donoAtual;

    if (novoDono !== 12) {
      if (mudandoDono) {
        // Se o dono atual não é o sistema (12), não deixa mudar direto
        if (donoAtual !== 12) {
          // Registra a solicitação de transferência
          await Anuencia.update({
            solicitacaoProtocolo: true,
            newUserId: novoDono,
          });

          return res.status(202).json({
            message:
              "Solicitação de transferência enviada ao dono atual do Protocolo.",
          });
        }
      }
    }
    if (respondido == true) {
      edicaoProtocolo.cobrancas = 0;
    }
    let answerDate = respondido ? new Date() : edicaoProtocolo.respondido;
    let novoStatus =
      !protocoloStatus && respondido
        ? "AGUARDANDO DER"
        : protocoloStatus || edicaoProtocolo.protocoloStatus;

    if (respondido == false || edicaoProtocolo.respondido == false) {
      edicaoProtocolo.dataResposta = null;
      edicaoProtocolo.mensagemResposta = null;
    }

    const user = await User.findByPk(novoDono);
    await edicaoProtocolo.update({
      protocolo,
      area,
      tipoAnuencia,
      dataFinal,
      rodovia,
      dataResposta: answerDate,
      ultimaInteracao,
      respondido,
      protocoloStatus: novoStatus,
      userId,
      contatoId,
      mensagemParaEnvio,
      prioridade,
      solicitacaoProtocolo,
      newUserId,
      ano,
    });

    if (novoDono !== 12) {
      await user.update({
        editados: (user.editados || 0) + 1,
      });
    }

    res.json(edicaoProtocolo);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Erro ao editar o Protocolo. Tente novamente mais tarde.",
    });
  }
};

export const deletarAnuencia = async (req, res) => {
  try {
    const deletarAnuencia = await Anuencia.findByPk(req.params.id);
    if (!deletarAnuencia) {
      return res.status(404).json({ error: "Protocolo não encontrado" });
    }

    await deletarAnuencia.destroy();
    res.json({ message: "Protocolo deletado com sucesso" });
  } catch (error) {
    console.error(error); // Log do erro
    res.status(500).json({
      error: "Erro ao deletar o Protocolo. Tente novamente mais tarde.",
    });
  }
};
