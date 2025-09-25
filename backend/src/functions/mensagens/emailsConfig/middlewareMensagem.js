import { sendWhatsAppMessage } from "../whatsMensagem.js";
import { sendEmailMessage } from "./emailMensagem.js";

export function isSameDay(date1, date2) {
  return (
    date1.toISOString().split("T")[0] === date2.toISOString().split("T")[0]
  );
}

export async function enviarMensagem(proces, now, mensagem, contato) {
  // await sendWhatsAppMessage(proces.number, mensagem, contato);
  await sendEmailMessage(proces, mensagem, contato);

  // calcula diferença em dias entre now e lastInteration
  const lastInteration = proces.lastInteration
    ? new Date(proces.lastInteration)
    : null;
  const diffDays = lastInteration
    ? Math.floor((now - lastInteration) / (1000 * 60 * 60 * 24))
    : Infinity; // se não tiver interação, considera infinito para poder aumentar

  // só aumenta cobranças se já passou 30 dias
  if (diffDays >= 30) {
    proces.cobrancas = (proces.cobrancas || 0) + 1;
  }

  proces.lastSent = now;
  await proces.save();

  console.log(
    `[SALVO] lastSent atualizado para ${proces.lastSent} do processo ${proces.processoSider}`
  );
}