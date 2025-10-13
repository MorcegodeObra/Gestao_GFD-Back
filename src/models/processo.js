import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

export const Process = sequelize.define("Process", {
  processoSider: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      name: "unique_processoSider",
      msg: "Já existe um processo com este número (processoSider) cadastrado.",
    },
    validate: {
      notEmpty: { msg: "O processoSider não pode ser vazio" },
      isValidFormat(value) {
        // Exemplo: formato "123/2025"
        if (!/^\d+\/\d{4}$/.test(value)) {
          throw new Error("processoSider deve estar no formato '123/AAAA'");
        }
      },
      async isUnique(value) {
        // Validação manual antes de tentar salvar
        const existing = await this.constructor.findOne({
          where: { processoSider: value },
        });
        if (existing && existing.id !== this.id) {
          throw new Error(
            "Já existe um processo com este processo cadastrado."
          );
        }
      },
    },
  },
  protocolo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: { msg: "O protocolo não pode ser vazio" } },
  },
  area: {
    type: DataTypes.ENUM(
      "AREA 1",
      "AREA 2",
      "AREA 3",
      "AREA 4",
      "AREA 5",
      "SEM AREA"
    ),
    defaultValue: "SEM AREA",
    validate: {
      isIn: {
        args: [["AREA 1", "AREA 2", "AREA 3", "AREA 4", "AREA 5", "SEM AREA"]],
        msg: "Área inválida",
      },
    },
  },
  rodovia: {
    type: DataTypes.STRING,
    defaultValue: "Rodovia não adicionada ao processo.",
    allowNull: true,
  },
  lastSent: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  answerMsg: { type: DataTypes.TEXT, allowNull: true },
  answerDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  lastInteration: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  answer: { type: DataTypes.BOOLEAN, defaultValue: false },
  contatoStatus: {
    type: DataTypes.ENUM(
      "REVISÃO DE PROJETO",
      "IMPLANTAÇÃO",
      "VISTORIA INICIAL",
      "VISTORIA FINAL",
      "ASSINATURAS",
      "CONCLUIDO",
      "CANCELADO/ARQUIVADO",
      "AGUARDANDO DER",
      "SEM STATUS",
      "ANALISE AMBIENTAL",
      "PAGAMENTO DA GR"
    ),
    defaultValue: "SEM STATUS",
  },
  userId: {
    type: DataTypes.INTEGER,
    references: { model: "Users", key: "id" },
    allowNull: false,
    validate: { notEmpty: { msg: "userId é obrigatório" } },
  },
  contatoId: {
    type: DataTypes.INTEGER,
    references: { model: "Contacts", key: "id" },
    allowNull: false,
    validate: { notEmpty: { msg: "contatoId é obrigatório" } },
  },
  subject: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: { notEmpty: { msg: "subject é obrigatório" } },
  },
  priority: {
    type: DataTypes.ENUM("BAIXO", "MÉDIO", "ALTO", "URGENTE"),
    defaultValue: "BAIXO",
  },
  vistoriaInicial: { type: DataTypes.BOOLEAN, defaultValue: false },
  processoComDER: { type: DataTypes.BOOLEAN, defaultValue: false },
  inconformidadeSolicitacao: { type: DataTypes.BOOLEAN, defaultValue: false },
  solicitacaoProcesso: { type: DataTypes.BOOLEAN, defaultValue: false },
  newUserId: { type: DataTypes.INTEGER, allowNull: true },
  ano: { type: DataTypes.INTEGER, allowNull: true },
  cobrancas: { type: DataTypes.INTEGER, defaultValue: 0 },
  tipoDeOcupacao: {
    type: DataTypes.ENUM("ANEXO I", "ANEXO II", "ANEXO III", "S/A"),
    defaultValue: "S/A",
  },
  especificacaoDeOcupacao: {
    type: DataTypes.ENUM("LONGITUDINAL", "TRANSVERSAL", "AMBOS", "S/A"),
    defaultValue: "S/A",
  },
});

// Mantendo lógica para extrair ano do processoSider
Process.beforeCreate((process) => {
  const partes = process.processoSider.split("/");
  if (partes.length > 1) {
    const anoExtraido = parseInt(partes[1]);
    if (!isNaN(anoExtraido)) process.ano = anoExtraido;
  }
});

Process.beforeUpdate((process) => {
  const partes = process.processoSider.split("/");
  if (partes.length > 1) {
    const anoExtraido = parseInt(partes[1]);
    if (!isNaN(anoExtraido)) process.ano = anoExtraido;
  }
});
