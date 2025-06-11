import { sendWhatsAppMessage } from '../whatsMensagem.js';
import { sendEmailMessage } from '../emailsConfig/emailMensagem.js';

export function isSameDay(date1, date2) {
  return date1.toISOString().split('T')[0] === date2.toISOString().split('T')[0];
}

export async function enviarMensagem(proces, now, mensagem, contato) {
  await sendWhatsAppMessage(proces.number, mensagem, contato);
  await sendEmailMessage(proces, mensagem, contato);
  proces.lastSent = now;
  await proces.save();
  console.log(`[SALVO] lastSent atualizado para ${proces.lastSent} do processo ${proces.processoSider}`);
}