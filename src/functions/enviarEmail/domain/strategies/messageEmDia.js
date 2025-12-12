import { BaseMensagemStrategy } from "../strategies/baseMessageStrategy.js";
import { DeveNotificar } from "../services/shouldNotify.js";

export class MensagemAcompanhamento extends BaseMensagemStrategy {
  constructor() {
    super();
    this.DeveNotificar = new DeveNotificar();
  }
  deveEnviar(processo, now) {
    return this.DeveNotificar.notificar(processo, now);
  }

  getTitulo() {
    return "⏳ Acompanhamento de prazo";
  }

  getCorpo(processo, contato, now) {
    const lastInteration = new Date(processo.lastInteration);
    const diasSemAtualizacao = Math.floor(
      (now - lastInteration) / (1000 * 60 * 60 * 24)
    );
    let prazoLimite;
    if (processo.contatoStatus === "IMPLANTAÇÃO") {
      prazoLimite = 180;
    } else {
      prazoLimite = 30;
    }
    const diasRestantes = prazoLimite -diasSemAtualizacao;
    return `
    Atualmente restam <strong>${diasRestantes} dias</strong> para o vencimento do prazo de ${prazoLimite} dias para o envio das informações.<br> 
    Se já estiver providenciando, não é necessária nenhuma ação adicional neste momento.<br>
  `;
  }
}
