import cron from 'node-cron';
import { getPendingContacts } from './funcoesMensagens/getPendingContacts.js';
import { shouldNotify } from './funcoesMensagens/shouldNotify.js';
import { checkEmailReply } from './funcoesMensagens/checkEmailReply.js';
import { sendWhatsAppMessage } from './funcoesMensagens/whatsMensagem.js';
import { sendEmailMessage } from './funcoesMensagens/emailMensagem.js';
import { User } from '../models/users.js';

export const runCronJob = cron.schedule('* * * * *', async () => {
  console.log("Cron rodando!")
  try {
    const userLogs = {};
    const now = new Date();
    const contacts = await getPendingContacts();

    for (const contact of contacts) {
      const userId = contact.userId;
      const lastSent = contact.lastSent ? new Date(contact.lastSent) : null;

      // Preparar lista
      if (!userLogs[userId]) userLogs[userId] = [];

      // Verificação de resposta por e-mail
      const emailRespondido = await checkEmailReply(contact);
      if (emailRespondido) {
        contact.answer = true;
        await contact.save();

        userLogs[userId].push(`📧 ${contact.processoSider} respondeu por e-mail. Marcado como respondido.`);
        continue;
      }

      // Verificação por prioridade ou status
      const deveNotificar = shouldNotify(contact, now);
      if (deveNotificar) {
        const mensagem = `Olá, ${contact.name}, tudo bem? - ${contact.subject}`;

        await sendWhatsAppMessage(contact.number, mensagem);
        await sendEmailMessage(contact, mensagem);

        contact.lastSent = now;
        await contact.save();

        userLogs[userId].push(`✅ Mensagem enviada para ${contact.processoSider} (prioridade/status).`);
        continue;
      }

      // Verificação de 30 dias sem resposta
      const diffInDays = (now - lastSent) / (1000 * 3600 * 24);
      if (diffInDays >= 30 && !contact.answer) {
        const noResponseMessage = `Não houve resposta do processo ${contact.processoSider} no email ${contact.email} após 30 dias.`;

        await sendWhatsAppMessage(contact.number, noResponseMessage);
        await sendEmailMessage(contact, noResponseMessage);

        contact.lastSent = now;
        await contact.save();

        userLogs[userId].push(`❌ ${contact.processoSider} não respondeu após 30 dias. Aviso reenviado.`);
      } else {
        userLogs[userId].push(`🕒 ${contact.processoSider} ainda dentro do prazo. Nenhuma mensagem enviada.`);
      }
    }

    // Enviar resumos
    for (const userId in userLogs) {
      if (!userId || userId === 'undefined') continue;

      const user = await User.findByPk(userId);
      if (!user) continue;

      const lastResumo = user.userResumo ? new Date(user.userResumo) : null;
      const hoje = new Date();

      const recebeuHoje =
        lastResumo &&
        lastResumo.getDate() === hoje.getDate() &&
        lastResumo.getMonth() === hoje.getMonth() &&
        lastResumo.getFullYear() === hoje.getFullYear();

      if (!recebeuHoje) {
        const mensagens = userLogs[userId].join('\n');
        const resumoMsg = `🗒️ RESUMO DIÁRIO DE AÇÕES:\n\n${mensagens}`;

        await sendEmailMessage({ email: user.userEmail }, resumoMsg);
        await sendWhatsAppMessage(user.userNumber, resumoMsg);

        user.userResumo = new Date();
        await user.save();
      }
    }

  } catch (err) {
    console.error('Erro ao executar o cron job para envio de mensagens:', err);
  }
});
