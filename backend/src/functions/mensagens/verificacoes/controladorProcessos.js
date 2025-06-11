import { shouldNotify } from './shouldNotify.js';
import { Contact } from '../../../models/contato.js';
import {enviarMensagem, isSameDay} from "../emailsConfig/enviarMensagem.js";


export async function handleContact(proces, now) {
  const contato = await Contact.findByPk(proces.contatoId)
  const lastInteration = proces.lastInteration ? new Date(proces.lastInteration) : null;

  if (lastInteration && !proces.answer) {
    const diasSemAtualizacao = Math.floor((now - lastInteration) / (1000 * 60 * 60 * 24));
    const lastSent = proces.lastSent ? new Date(proces.lastSent) : null;
    const mesmoDia = lastSent && isSameDay(lastSent, now)

    if (diasSemAtualizacao >= 30 && !mesmoDia) {
      const mensagem = `Contato Automático: Não houve resposta do processo ${proces.processoSider} no email ${contato.email} após 30 dias desde o primeiro contato, algum retorno sobre o processo??`;
      await enviarMensagem(proces, now, mensagem, contato);
      return;
    } else {
    }

    const deveNotificar = shouldNotify(proces, now);
    if (deveNotificar) {
      const mensagem = `Contato Automático: Olá, ${contato.name}, tudo bem? - Essa é uma mensagem sobre uma ocupação de faixa de dominio: ${proces.subject}`;
      await enviarMensagem(proces, now, mensagem, contato);
      return;
    }
  }
}