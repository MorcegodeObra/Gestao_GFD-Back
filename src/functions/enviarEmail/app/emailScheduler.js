import { ServicoCobranca } from "./emailController.js";

const servico = new ServicoCobranca();

export async function iniciarCobranca() {
  await servico.executar();
  setInterval(() => servico.executar(), 5 * 60 * 1000);
}
