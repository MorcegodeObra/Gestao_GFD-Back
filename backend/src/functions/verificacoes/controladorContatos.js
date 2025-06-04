import { shouldNotify } from './shouldNotify.js';
import { checkEmailReply } from './checkEmailReply.js';
import { sendWhatsAppMessage } from '../whatsMensagem.js';
import { sendEmailMessage } from '../emailsConfig/emailMensagem.js';

async function enviarMensagem(contact, now, mensagem) {
  await sendWhatsAppMessage(contact.number, mensagem);
  await sendEmailMessage(contact, mensagem);
  contact.lastSent = now;
  await contact.save();
}

export async function handleContact(contact, now, userLogs) {
  const userId = contact.userId;
  const lastInteration = contact.lastInteration ? new Date(contact.lastInteration) : null;

  if (!userLogs[userId]) userLogs[userId] = [];

  const emailRespondido = await checkEmailReply(contact);
  if (emailRespondido || contact.answer == true) {
    contact.answer = true;
    contact.sentToday = true
    contact.lastInteration = now;
    await contact.save();
    userLogs[userId].push(`📧 ${contact.processoSider} respondeu por e-mail. Marcado como respondido.`);
    return;
  }

  if (lastInteration && !contact.answer) {
    const diasSemAtualizacao = Math.floor((now - lastInteration) / (1000 * 60 * 60 * 24));
    const lastSent = contact.lastSent ? new Date(contact.lastSent) : null;
    const mesmoDia = lastSent &&
      lastSent.getFullYear() === now.getFullYear() &&
      lastSent.getMonth() === now.getMonth() &&
      lastSent.getDate() === now.getDate();

    if (diasSemAtualizacao >= 30 && !mesmoDia) {
      const mensagem = `Contato Automático: Não houve resposta do processo ${contact.processoSider} no email ${contact.email} após 30 dias desde o primeiro contato, algum retorno sobre o processo??`;
      await enviarMensagem(contact, now, mensagem);
      userLogs[userId].push(`❌ ${contact.processoSider} não respondeu após 30 dias desde o primeiro envio. Aviso reenviado.`);
      return;
    } else {
      userLogs[userId].push(`🕒 ${contact.processoSider} ainda dentro dos 30 dias desde o primeiro envio.`);
    }

    const deveNotificar = shouldNotify(contact, now);
    if (deveNotificar) {
      const mensagem = `Contato Automático: Olá, ${contact.name}, tudo bem? - Essa é uma mensagem sobre uma ocupação de faixa de dominio: ${contact.subject}`;
      await enviarMensagem(contact, now, mensagem);
      userLogs[userId].push(`✅ Mensagem enviada para ${contact.processoSider} (prioridade/status).`);
      return;
    }
  }
}