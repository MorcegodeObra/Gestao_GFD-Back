import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

export const Anuencia = sequelize.define("Anuencia", {
  protocolo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
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
  },
  tipoAnuencia: {
    type: DataTypes.ENUM("ANUENCIA", "USOCAPIAO", "SEM STATUS"),
    allowNull: false,
  },
  dataFinal: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  rodovia: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ultimoEnvio: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  mensagemResposta: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  dataResposta: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  ultimaInteracao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  respondido: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  protocoloStatus: {
    type: DataTypes.ENUM(
      "LEVANTAMENTO TOPOGRAFICO",
      "IR OBRA",
      "ANALISE TÉCNICA",
      "FINALIZADO",
      "AGUARDANDO DER",
      "SEM STATUS"
    ),
    defaultValue: "SEM STATUS",
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: "Users",
      key: "id",
    },
    allowNull: false,
  },
  contatoId: {
    type: DataTypes.INTEGER,
    references: {
      model: "Contacts",
      key: "id",
    },
    allowNull: false,
  },
  mensagemParaEnvio: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  prioridade: {
    type: DataTypes.ENUM("BAIXO", "MEDIO", "ALTO", "URGENTE"),
    defaultValue: "BAIXO",
  },
  solicitacaoProtocolo: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  newUserId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  ano: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  cobrancas: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});
