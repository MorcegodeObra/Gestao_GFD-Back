import { BaseMensagemStrategy } from "../strategies/baseMessageStrategy.js";
import { DeveNotificar } from "../services/shouldNotify.js";

export class MensagemPrazoVencido extends BaseMensagemStrategy {
  constructor() {
    super();
    this.DeveNotificar = new DeveNotificar();
  }

  deveEnviar(processo, now) {
    return this.DeveNotificar.notificar(processo, now);
  }


  getTitulo() {
    return "⚠️ Prazo vencido";
  }

  getCorpo(processo, contato, now) {
    const lastInteration = new Date(processo.lastInteration);
    const diasSemAtualizacao = Math.floor(
      (now - lastInteration) / (1000 * 60 * 60 * 24)
    );

    // === REGRA DO PRAZO REAL ===
    let prazoLimite;
    if (processo.contatoStatus === "IMPLANTAÇÃO") {
      prazoLimite = 180;
    } else {
      prazoLimite = 30;
    }

    const expiradoHa = diasSemAtualizacao - prazoLimite;

    return `Verificamos que o prazo de <strong>${prazoLimite} dias</strong> para o envio das informações expirou há <strong>${expiradoHa} dias</strong>.<br><br>
  Solicitamos, por gentileza, o envio da documentação pendente ou uma atualização sobre o andamento da demanda.<br>
  Caso a documentação já tenha sido encaminhada, pedimos a gentileza de confirmar o envio por este e-mail ou diretamente com o responsável pelo processo.`;
  }

}
