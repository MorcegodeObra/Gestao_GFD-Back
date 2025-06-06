import { User } from '../../../models/users.js';
import { sendResumo } from './mensagemResumoSemanal.js';
import { sendWhatsAppMessage } from '../whatsMensagem.js';

export async function sendWeeklySummaries(userLogs) {
  const hoje = new Date();
  const diaSemana = hoje.getDay(); // 5 = sexta-feira

  if (diaSemana !== 5) return;

  for (const userId in userLogs) {
    if (!userId || userId === 'undefined') continue;

    const user = await User.findByPk(userId);
    if (!user) continue;

    // ⛔ Evita reenvio se o resumo já foi enviado hoje
    if (user.userResumo) {
      const ultimaData = new Date(user.userResumo);

      const mesmaData =
        ultimaData.getFullYear() === hoje.getFullYear() &&
        ultimaData.getMonth() === hoje.getMonth() &&
        ultimaData.getDate() === hoje.getDate();

      if (mesmaData) continue; // já foi enviado hoje
    }

    const mensagens = userLogs[userId].join('\n');
    const resumoMsg = `🗒️ RESUMO SEMANAL DE AÇÕES:\n\n${mensagens}`;

    await sendResumo({ email: user.userEmail }, resumoMsg);
    await sendWhatsAppMessage(user.userNumber, resumoMsg);

    user.userResumo = hoje;
    await user.save();
  }
}

