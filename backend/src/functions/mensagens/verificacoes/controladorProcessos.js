import { shouldNotify } from './shouldNotify.js';
import { checkEmailReply } from './checkEmailReply.js';
import { sendWhatsAppMessage } from '../whatsMensagem.js';
import { sendEmailMessage } from '../emailsConfig/emailMensagem.js';
import { Contact } from '../../../models/contato.js';

async function enviarMensagem(proces, now, mensagem,contato) {
  await sendWhatsAppMessage(proces.number, mensagem,contato);
  await sendEmailMessage(proces, mensagem,contato);
  proces.lastSent = now;
  await proces.save();
}

export async function handleContact(proces, now, userLogs) {
  const userId = proces.userId;
  const contato = await Contact.findByPk(proces.contatoId)
  const lastInteration = proces.lastInteration ? new Date(proces.lastInteration) : null;

  if (!userLogs[userId]) userLogs[userId] = [];

  const emailRespondido = await checkEmailReply(proces);
  if (emailRespondido || proces.answer == true) {
    proces.answer = true;
    proces.lastInteration = now;
    await proces.save();
    userLogs[userId].push(`📧 ${proces.processoSider} respondeu por e-mail. Marcado como respondido.`);
    return;
  }

  if (lastInteration && !proces.answer) {
    const diasSemAtualizacao = Math.floor((now - lastInteration) / (1000 * 60 * 60 * 24));
    const lastSent = proces.lastSent ? new Date(proces.lastSent) : null;
    const mesmoDia = lastSent &&
      lastSent.getFullYear() === now.getFullYear() &&
      lastSent.getMonth() === now.getMonth() &&
      lastSent.getDate() === now.getDate();

    if (diasSemAtualizacao >= 30 && !mesmoDia) {
      const mensagem = `Contato Automático: Não houve resposta do processo ${proces.processoSider} no email ${contato.email} após 30 dias desde o primeiro contato, algum retorno sobre o processo??`;
      await enviarMensagem(proces, now, mensagem,contato);
      userLogs[userId].push(`❌ ${proces.processoSider} não respondeu após 30 dias desde o primeiro envio. Aviso reenviado.`);
      return;
    } else {
      userLogs[userId].push(`🕒 ${proces.processoSider} ainda dentro dos 30 dias desde o primeiro envio.`);
    }

    const deveNotificar = shouldNotify(proces, now);
    if (deveNotificar) {
      const mensagem = `Contato Automático: Olá, ${contato.name}, tudo bem? - Essa é uma mensagem sobre uma ocupação de faixa de dominio: ${proces.subject}`;
      await enviarMensagem(proces, now, mensagem,contato);
      userLogs[userId].push(`✅ Mensagem enviada para ${proces.processoSider} (prioridade/status).`);
      return;
    }
  }
}