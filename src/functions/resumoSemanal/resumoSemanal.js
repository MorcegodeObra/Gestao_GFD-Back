import { User } from "../../models/users.js";
import { Process } from "../../models/processo.js";
import { sendResumo } from "./mensagemResumoSemanal.js";
import { Op, where } from "sequelize";

async function resumoSemanal() {
  console.log("Rodando resumo semanal!!");
  const hoje = new Date();
  const diaSemana = hoje.getDay(); // 5 = sexta-feira
  const umaSemanaAtras = new Date();
  umaSemanaAtras.setDate(hoje.getDate() - 5);

  if (diaSemana !== 5) return;

  const users = await User.findAll({ where: { id: { [Op.notIn]: [12] } } });

  for (const user of users) {
    if (!user || !user.id) continue;
    const criados = user.criados;
    const modificados = user.editados;

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

    let mensagensAtraso = 0;
    let mensagensEmDia = 0;

    for (const proces of processos) {
      const dataEnvio = proces.lastInteration || proces.lastSent;
      if (!dataEnvio) continue; // ignora se não houver data

      const diasDesdeEnvio = Math.floor(
        (hoje - new Date(dataEnvio)) / (1000 * 60 * 60 * 24)
      );

      if (diasDesdeEnvio > 30) {
        mensagensAtraso++;
      } else {
        mensagensEmDia++;
      }
    }

    await sendResumo(
      user.userEmail,
      mensagensEmDia,
      mensagensAtraso,
      criados,
      modificados,
      comUsuario,
      semUsuario
    );
    console.log(`Resumo enviado para ${user.userEmail} com sucesso.`);

    //await sendWhatsAppMessage(user.userNumber, resumoMsg);
    user.userResumo = hoje;
    user.criados = 0;
    user.editados = 0;
    await user.save();
  }
}

export async function iniciarResumo() {
  await resumoSemanal();
  console.log("Resumos enviados");
  setInterval(sendResumo, 10 * 60 * 1000);
}
