import { User } from '../../models/users.js';
import { Process } from '../../models/processo.js';
import { sendResumo } from './emailsConfig/mensagemResumoSemanal.js';
import { sendWhatsAppMessage } from './whatsMensagem.js';
import cron from 'node-cron';
import { Op } from 'sequelize';

export const sendWeeklySummaries = cron.schedule('*/15 * * * *', async () => {
  console.log("Rodando resumo semanal!!")
  const hoje = new Date();
  const diaSemana = hoje.getDay(); // 5 = sexta-feira
  const umaSemanaAtras = new Date();
  umaSemanaAtras.setDate(hoje.getDate() - 7);

  if (diaSemana !== 5) return;

  const users = await User.findAll();

  for (const user of users) {
    if (!user || !user.id) continue;
    // Novos processos
    const criados = await Process.count({
      where: {
        userId: user.id,
        createdAt: {
          [Op.gte]: umaSemanaAtras
        }
      }
    });

    // Processos modificados (interações recentes)
    const modificados = await Process.count({
      where: {
        userId: user.id,
        lastInteration: {
          [Op.gte]: umaSemanaAtras
        }
      }
    });

    const [comUsuario, semUsuario] = await Promise.all([
      Process.count({ where: { userId: user.id, processoComDER: true } }),
      Process.count({ where: { userId: user.id, processoComDER: false } }),
    ]);
    // ⛔ Evita reenvio se o resumo já foi enviado hoje
    if (user.userResumo) {
      const ultimaData = new Date(user.userResumo);

      const mesmaData =
        ultimaData.getFullYear() === hoje.getFullYear() &&
        ultimaData.getMonth() === hoje.getMonth() &&
        ultimaData.getDate() === hoje.getDate();

      if (mesmaData) continue; // já foi enviado hoje
    }

    // Busca todos os processos do usuário
    const processos = await Process.findAll({ where: { userId: user.id } });

    if (!processos.length) continue;

    const mensagensAtraso = [];
    const mensagensData = [];
    const mensagensRespondido = [];

    for (const proces of processos) {
      if (proces.answer) {
        mensagensRespondido.push(`✅ Processo ${proces.processoSider} respondido`);
        continue;
      }

      const dataEnvio = proces.lastInteration || proces.lastSent;
      const diasDesdeEnvio = Math.floor((hoje - dataEnvio) / (1000 * 60 * 60 * 24));
      if (!dataEnvio) continue;

      if (diasDesdeEnvio > 30) {
        mensagensAtraso.push(`❌ ${proces.processoSider} não respondeu após 30 dias desde o primeiro envio. Aviso reenviado.`);
      } else {
        mensagensData.push(`🕒 ${proces.processoSider} ainda dentro dos 30 dias desde o primeiro envio.`);
      }
    }
    if (mensagensRespondido.length === 0) {
      mensagensRespondido.push("Sem processos respondidos.");
    }

    if (mensagensData.length === 0) {
      mensagensData.push("Sem processos dentro dos 30 dias.");
    }

    if (mensagensAtraso.length === 0) {
      mensagensAtraso.push("Sem processos em atraso.");
    }

    await sendResumo(user.userEmail, mensagensData.length, mensagensAtraso.length, criados, modificados, comUsuario, semUsuario);
    //await sendWhatsAppMessage(user.userNumber, resumoMsg);
    console.log(`Resumo Enviado para ${user.userName} no dia ${hoje}`);
    user.userResumo = hoje;
    await user.save();
  }
});
