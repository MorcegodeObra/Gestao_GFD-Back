import { shouldNotify } from './shouldNotify.js';
import { Contact } from '../../../models/contato.js';
import { enviarMensagem, isSameDay } from "../emailsConfig/enviarMensagem.js";
import { gerarMensagemHTML } from '../emailsConfig/gerarMensagemHTML.js';
import { ContactEmail } from '../../../models/contactEmail.js';
import { ContactNumber } from '../../../models/contactNumber.js';
import { differenceInDays } from 'date-fns';

export async function handleContact(proces, now) {
  const contato = await Contact.findByPk(proces.contatoId, {
    include: [
      { model: ContactEmail },
      { model: ContactNumber }
    ]
  })
  const lastInteration = proces.lastInteration ? new Date(proces.lastInteration) : null;
  let titulo = '';
  let corpo = '';

  if (lastInteration && !proces.answer) {
    const diasSemAtualizacao = Math.floor((now - lastInteration) / (1000 * 60 * 60 * 24));
    const lastSent = proces.lastSent ? new Date(proces.lastSent) : null;
    const doisDias = lastSent && differenceInDays(now,lastSent)>=2;
    const diasRestantes = 30 - diasSemAtualizacao

    if (diasSemAtualizacao >= 30 && doisDias) {
      titulo = '⚠️ Prazo vencido';
      corpo = `
      Verificamos que o prazo de 30 dias para o envio das informações expirou há <strong>${diasSemAtualizacao - 30} dias</strong>.<br><br>
      Solicitamos, por gentileza, o envio da documentação pendente ou atualização sobre o andamento da demanda.<br><br>
      Caso já tenha enviado, favor desconsiderar esta mensagem.
    `;
      const mensagem = await gerarMensagemHTML(proces, contato, titulo, corpo)
      await enviarMensagem(proces, now, mensagem, contato);
      return;
    } else {
    }
    const deveNotificar = shouldNotify(proces, now);

    if (deveNotificar) {
      titulo = '⏳ Acompanhamento de prazo';
      corpo = `
      Atualmente restam <strong>${diasRestantes} dias</strong> para o vencimento do prazo de 30 dias para o envio das informações.<br><br>
      Se já estiver providenciando, não é necessária nenhuma ação adicional neste momento.<br><br>
      Permanecemos à disposição para dúvidas.
    `;
      const mensagem = await gerarMensagemHTML(proces, contato, titulo, corpo)
      await enviarMensagem(proces, now, mensagem, contato);
      return;
    }
  }
}