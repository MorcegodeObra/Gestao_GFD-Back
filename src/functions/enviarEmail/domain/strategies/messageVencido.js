import { differenceInDays } from "date-fns";
import { BaseMensagemStrategy } from "../strategies/baseMessageStrategy.js";

export class MensagemPrazoVencido extends BaseMensagemStrategy {
  deveEnviar(processo, now) {
    const lastInteration = new Date(processo.lastInteration);
    const lastSent = processo.lastSent ? new Date(processo.lastSent) : null;
    const dias = (now - lastInteration) / (1000 * 60 * 60 * 24);
    const tresDias = lastSent && differenceInDays(now, lastSent) >= 3;
    return dias >= 30 && tresDias;
  }

  getTitulo() {
    return "⚠️ Prazo vencido";
  }

  getCorpo(processo, contato, now) {
    const diasSemAtualizacao = Math.floor(
      (now - new Date(processo.lastInteration)) / (1000 * 60 * 60 * 24)
    );
    return `Verificamos que o prazo de <strong>30 dias</strong> para o envio das informações expirou há <strong>
    ${
      diasSemAtualizacao - 30
    } dias</strong>.<br><br> Solicitamos, por gentileza, o envio da documentação pendente ou uma atualização sobre o andamento da demanda. Conforme disposto no Decreto 140/2015, o não envio dentro do prazo de 30 dias sujeita o interessado ao pagamento de nova taxa de vistoria e análise de projeto.<br> 
    Caso a documentação já tenha sido encaminhada, pedimos a gentileza de confirmar o envio por este e-mail ou diretamente com o responsável pelo processo.`;
  }
}
