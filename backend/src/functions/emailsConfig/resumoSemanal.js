import { User } from '../../models/users.js';
import { sendResumo } from './mensagemResumoSemanal.js';
import { sendWhatsAppMessage } from '../whatsMensagem.js';

export async function sendWeeklySummaries(userLogs) {
  const hoje = new Date();
  const diaSemana = hoje.getDay(); // 5 = sexta-feira

  // ⛔ Se hoje não for sexta-feira, sai
  if (diaSemana !== 5) return;

  for (const userId in userLogs) {
    if (!userId || userId === 'undefined') continue;

    const user = await User.findByPk(userId);
    if (!user) continue;

    const mensagens = userLogs[userId].join('\n');
    const resumoMsg = `🗒️ RESUMO SEMANAL DE AÇÕES:\n\n${mensagens}`;

    await sendResumo({ email: user.userEmail }, resumoMsg);
    await sendWhatsAppMessage(user.userNumber, resumoMsg);

    user.userResumo = hoje;
    await user.save();
  }
}
