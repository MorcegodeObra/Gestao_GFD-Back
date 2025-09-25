import { shouldNotify } from './shouldNotify.js';
import { Contact } from '../../../models/contato.js';
import { enviarMensagem, isSameDay } from "../emailsConfig/middlewareMensagem.js";
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
      Verificamos que o prazo de <strong>30 dias</strong> para o envio das informações expirou há <strong>${diasSemAtualizacao - 30} dias</strong>.<br><br>
      Solicitamos, por gentileza, o envio da documentação pendente ou uma atualização sobre o andamento da demanda. Conforme disposto no Decreto 140/2015, 
      o não envio dentro do prazo de 30 dias sujeita o interessado ao pagamento de nova taxa de vistoria e análise de projeto.<br>
      Caso a documentação já tenha sido encaminhada, pedimos a gentileza de confirmar o envio por este e-mail ou diretamente com o responsável pelo processo.
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
      Atualmente restam <strong>${diasRestantes} dias</strong> para o vencimento do prazo de 30 dias para o envio das informações.<br>
      Se já estiver providenciando, não é necessária nenhuma ação adicional neste momento.<br>
    `;
      const mensagem = await gerarMensagemHTML(proces, contato, titulo, corpo)
      await enviarMensagem(proces, now, mensagem, contato);
      return;
    }
  }
}