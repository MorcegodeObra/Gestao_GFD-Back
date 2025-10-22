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
    const diasRestantes = diasSemAtualizacao - 30;
    return `
    Atualmente restam <strong>${diasRestantes} dias</strong> para o vencimento do prazo de 30 dias para o envio das informações.<br> 
    Se já estiver providenciando, não é necessária nenhuma ação adicional neste momento.<br>
  `;
  }
}
