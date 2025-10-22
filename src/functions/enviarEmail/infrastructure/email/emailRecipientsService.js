import { User } from "../../../../models/users.js";
import { ContactEmail } from "../../../../models/contactEmail.js";

export class EmailRecipientsService {
  async getRecipients(processo, contato) {
    const ccList = [];

    // 1️⃣ Último usuário responsável
    if (processo.userId) {
      const user = await User.findByPk(processo.userId);
      if (user?.userEmail) ccList.push(user.userEmail);
    }

    // 2️⃣ Coordenadores da área
    if (processo.area && processo.area !== "SEM AREA") {
      const coordenadores = await User.findAll({
        where: { userCargo: "COORDENADOR", userArea: processo.area },
      });

      for (const coord of coordenadores) {
        if (coord.userEmail && !ccList.includes(coord.userEmail)) {
          ccList.push(coord.userEmail);
        }
      }
    }

    // 3️⃣ E-mails do contato (filtrados por área e rodovia)
    const emails = await ContactEmail.findAll({
      where: { contactId: contato.id, area: processo.area },
    });

    const filtrados = emails.filter(e =>
      !e.rodovias?.length || e.rodovias.includes(processo.rodovia)
    );

    const destinatarios = filtrados.map(e => e.email);

    if (!destinatarios.length) {
      console.warn(
        `⚠️ Nenhum e-mail encontrado para área ${processo.area} no contato ${contato.name}`
      );
      destinatarios = ccList
    }

    return {
      to: destinatarios,
      cc: ccList,
    };
  }
}
