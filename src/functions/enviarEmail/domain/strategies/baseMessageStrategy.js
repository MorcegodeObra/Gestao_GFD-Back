export class BaseMensagemStrategy {
  deveEnviar(processo, now) { return false }
  getTitulo() { return '' }
  getCorpo(processo, contato, now) { return '' }
}
