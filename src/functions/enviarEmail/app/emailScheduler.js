import { ServicoCobranca } from "./emailController.js";

const servico = new ServicoCobranca();

export async function iniciarCobranca() {
  await servico.executar();
}
