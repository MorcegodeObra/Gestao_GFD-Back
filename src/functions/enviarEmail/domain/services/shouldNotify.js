export class DeveNotificar {
  async notificar(proces,now) {
    const priorityDays = {
      BAIXO: 4,
      MÉDIO: 3,
      ALTO: 2,
      URGENTE: 1,
    };
    const lastSent = proces.lastSent ? new Date(proces.lastSent) : null;
    if (!lastSent) return false;

    const diffInDays = (now - lastSent) / (1000 * 3600 * 24);

    if (proces.contatoStatus === "IMPLANTAÇÃO") {
      return diffInDays >= 140;
    }

    const priority = proces.priority || "BAIXO";
    const daysAllowed = priorityDays[priority];

    return diffInDays >= daysAllowed;
  }
}