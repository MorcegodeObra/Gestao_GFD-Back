import { User } from "../../../models/users.js";
import { ContactEmail } from "../../../models/contactEmail.js";
import { enviarEmail, transporter } from "../../../config/funcoesEmail.js";

export async function sendEmailMessage(proces, message, contato) {
  try {
    let ccList = [];

    // 📌 1. Adicionar quem modificou por último (userId)
    if (proces.userId) {
      const user = await User.findByPk(proces.userId);
      if (user?.userEmail) {
        ccList.push(user.userEmail);
      }
    }

    // 📌 2. Adicionar coordenador da área, se diferente do anterior
    if (proces.area && proces.area !== "SEM AREA") {
      const coordenadores = await User.findAll({
        where: {
          userCargo: "COORDENADOR",
          userArea: proces.area,
        },
      });

      for (const coord of coordenadores) {
        if (coord.userEmail && !ccList.includes(coord.userEmail)) {
          ccList.push(coord.userEmail);
        }
      }
    }

    // 🔥 Buscar o email correto pela área
    const emailsAreaRodovia = await ContactEmail.findAll({
      where: { contactId: contato.id, area: proces.area },
    });

    const emailsFiltrados = emailsAreaRodovia.filter((e) => {
      if (!e.rodovias || e.rodovias.length === 0) return true; // Se não há rodovias definidas, considerar só por área
      return e.rodovias.includes(proces.rodovia); // Se tem rodovias, só se coincidir com a do processo
    });

    const emailDestinos = emailsFiltrados.map((e) => e.email);
    if (!emailDestinos.length) {
      console.warn(
        `⚠️ Nenhum e-mail encontrado para área ${proces.area} no contato ${contato.name}`
      );
      return; // não envia nada se não houver e-mail correspondente
    }

    const from = `Solicitação - ${proces.processoSider} <${process.env.EMAIL_USER}>`;
    const to = emailDestinos.join(",");
    const cc = ccList.length > 0 ? ccList : undefined;
    const subject = `Solicitação - ${proces.processoSider}`;
    const body = message;

    await enviarEmail(from, to, cc, subject, body);
    console.log(
      `E-mail enviado para ${emailDestinos} (CC: ${
        ccList.join(", ") || "nenhum"
      })`
    );
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error.message);
  }
}
