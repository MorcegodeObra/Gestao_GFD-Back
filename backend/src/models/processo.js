import { DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

export const Process = sequelize.define('Process', {
    processoSider: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    protocolo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    area: {
        type: DataTypes.ENUM("AREA 1", "AREA 2", "AREA 3", "AREA 4", "AREA 5", "SEM AREA"),
        defaultValue: "SEM AREA"
    },
    rodovia: {
        type: DataTypes.STRING,
        defaultValue: "Rodovia não adicionada ao processo."
    },
    lastSent: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    answerMsg: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    answerDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    lastInteration: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    answer: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
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
            "PAGAMENTO DA GR",),
        defaultValue: "SEM STATUS"
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: "Users",
            key: "id",
        },
        allowNull: false
    },
    contatoId: {
        type: DataTypes.INTEGER,
        references: {
            model: "Contacts",
            key: "id",
        },
        allowNull: false
    },
    subject: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    priority: {
        type: DataTypes.ENUM("BAIXO", "MÉDIO", "ALTO", "URGENTE"),
        defaultValue: "BAIXO"
    },
    vistoriaInicial: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    processoComDER: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    inconformidadeSolicitacao: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    solicitacaoProcesso: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    newUserId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    ano: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    cobrancas: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    tipoDeOcupacao: {
        type: DataTypes.ENUM('ANEXO I','ANEXO II','ANEXO III','S/A'),
        defaultValue: "S/A"
    },
    especificacaoDeOcupacao: {
        type: DataTypes.ENUM("LONGITUDINAL",'TRANSVERSAL','AMBOS','S/A'),
        defaultValue: "S/A"
    },
})

Process.beforeCreate((process, options) => {
  const partes = process.processoSider.split('/');
  if (partes.length > 1) {
    const anoExtraido = parseInt(partes[1]);
    if (!isNaN(anoExtraido)) {
      process.ano = anoExtraido;
    }
  }
});

Process.beforeUpdate((process, options) => {
  const partes = process.processoSider.split('/');
  if (partes.length > 1) {
    const anoExtraido = parseInt(partes[1]);
    if (!isNaN(anoExtraido)) {
      process.ano = anoExtraido;
    }
  }
});
