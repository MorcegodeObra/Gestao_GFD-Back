import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";
import { SREDer } from "./codigoSRE.js";

export const Anuencia = sequelize.define("Anuencia", {
  informacao: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  verticesConfrontantes: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    defaultValue: ["Vertices não cadastrados"]
  },
  folhasMaterial: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    defaultValue: ["Folhas do material técnico não cadastrados"]
  },
  interessado: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Não informado",
  },
  assunto: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Não informado",
  },
  codigoSRE: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Não adicionado",
    validate: {
      notEmpty: { msg: "O codigoSRE não pode ser vazio" },
    },
  },
  protocolo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: "O protocolo não pode ser vazio" },
      isValidFormat(value) {
        // Exemplo: formato "123/2025"
        if (!/^\d+\/\d{4}$/.test(value)) {
          throw new Error("Protocolo deve estar no formato '123/AAAA'");
        }
      },
    },
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
    allowNull: false,
    validate: {
      isIn: {
        args: [["AREA 1", "AREA 2", "AREA 3", "AREA 4", "AREA 5", "SEM AREA"]],
        msg: "Área inválida",
      },
    },
  },
  tipoAnuencia: {
    type: DataTypes.ENUM("ANUENCIA", "USOCAPIAO", "SEM STATUS"),
    allowNull: false,
    validate: {
      isIn: {
        args: [["ANUENCIA", "USOCAPIAO", "SEM STATUS"]],
        msg: "Tipo de anuência inválido",
      },
    },
  },
  ladoDaAnuencia: {
    type: DataTypes.ENUM("DIREITO", "ESQUERDO", "Sem lado"),
    allowNull: false,
    defaultValue: "Sem lado"
  },
  dataFinal: {
    type: DataTypes.DATE,
    allowNull: true,
    validate: { isDate: { msg: "dataFinal deve ser uma data válida" } },
  },
  rodovia: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: { msg: "Rodovia não pode ser vazia" } },
  },
  ultimoEnvio: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    validate: { isDate: { msg: "ultimoEnvio deve ser uma data válida" } },
  },
  mensagemResposta: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  dataResposta: {
    type: DataTypes.DATE,
    allowNull: true,
    validate: { isDate: { msg: "dataResposta deve ser uma data válida" } },
  },
  ultimaInteracao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    validate: { isDate: { msg: "ultimaInteracao deve ser uma data válida" } },
  },
  respondido: { type: DataTypes.BOOLEAN, defaultValue: true },
  protocoloStatus: {
    type: DataTypes.ENUM(
      "LEVANTAMENTO TOPOGRAFICO",
      "IR OBRA",
      "ANALISE TÉCNICA",
      "FINALIZADO",
      "AGUARDANDO DER",
      "AGUARDANDO SOLICITANTE",
      "SEM STATUS"
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
  mensagemParaEnvio: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: { notEmpty: { msg: "mensagemParaEnvio é obrigatória" } },
  },
  prioridade: {
    type: DataTypes.ENUM("BAIXO", "MEDIO", "ALTO", "URGENTE"),
    defaultValue: "BAIXO",
  },
  fotosObra: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
  fotosMaterial: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
  solicitacaoProtocolo: { type: DataTypes.BOOLEAN, defaultValue: false },
  newUserId: { type: DataTypes.INTEGER, allowNull: true },
  ano: { type: DataTypes.INTEGER, allowNull: true },
  cobrancas: { type: DataTypes.INTEGER, defaultValue: 0, validate: { min: 0 } },
});

Anuencia.associate = (models) => {
  Anuencia.belongsTo(models.SREDers, {
    foreignKey: "codigoSRE",
    targetKey: "codigoSRE",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  });
};

