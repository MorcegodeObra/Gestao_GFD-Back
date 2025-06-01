const priorityDays = {
  'BAIXO': 5,
  'MÉDIO': 3,
  'ALTO': 2,
  'URGENTE': 1,
};

export function shouldNotify(contact, now) {
  const lastSent = contact.lastSent ? new Date(contact.lastSent) : null;
  if (!lastSent) return false;

  const diffInDays = (now - lastSent) / (1000 * 3600 * 24);

  if (contact.contatoStatus === 'IMPLANTAÇÃO') {
    return diffInDays >= 170;
  }

  const priority = contact.priority || 'BAIXO';
  const daysAllowed = priorityDays[priority];

  return diffInDays >= daysAllowed;
}
