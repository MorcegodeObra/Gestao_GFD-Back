import Imap from 'imap';
import { simpleParser } from 'mailparser';
import dotenv from 'dotenv';
import { Contact } from '../../../models/contato.js';
import extractReplyBody from "./extrairCorpoEmail.js";

dotenv.config();

// Simula uma função para buscar o contato (você pode substituir isso com acesso ao banco de dados real)
async function getContatoById(id) {
  // Exemplo com Sequelize ou outro ORM
  const contato = await Contact.findByPk(id); // ou getContato(id)
  return contato; // deve ter .email
}

export async function checkEmailReply(proces) {
  return new Promise(async (resolve, reject) => {
    const contato = await getContatoById(proces.contatoId);
    if (!contato.email) return resolve(false);

    const imap = new Imap({
      user: process.env.EMAIL_USER,
      password: process.env.EMAIL_PASS,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: {
        rejectUnauthorized: false,
      },
    });

    const emailsContato = Array.isArray(contato.email)
      ? contato.email.map(e => e.toLowerCase())
      : contato.email
        ? [contato.email.toLowerCase()]
        : [];
    const subjectQuery = `Solicitação - ${proces.processoSider}`;
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - 30);

    imap.once('ready', () => {
      imap.openBox('INBOX', false, (err) => {
        if (err) {
          imap.end();
          return reject(err);
        }

        imap.search([['SINCE', sinceDate.toDateString()]], (err, results) => {
          if (err || !results.length) {
            imap.end();
            return resolve(false);
          }

          const f = imap.fetch(results, { bodies: '' });

          let latestMsgDate = null;
          let latestMsgText = null;

          let messagesProcessed = 0;

          f.on('message', (msg) => {
            msg.on('body', (stream) => {
              simpleParser(stream, async (err, mail) => {
                messagesProcessed++;

                const from = (mail.from?.value?.[0]?.address || '').toLowerCase();
                const subject = mail.subject || '';
                const date = mail.date;

                // Verifica se o e-mail veio do contato e tem o assunto certo
                if (emailsContato.includes(from) && subject.includes(subjectQuery)) {
                  if (!latestMsgDate || date > latestMsgDate) {
                    latestMsgDate = date;
                    latestMsgText = mail.text || mail.html || null;
                  }
                }

                if (messagesProcessed === results.length) {
                  if (latestMsgText) {
                    const mensagemLimpa = extractReplyBody(latestMsgText)
                    proces.answer = true;
                    proces.answerDate = latestMsgDate;
                    proces.answerMsg = mensagemLimpa;
                    await proces.save();
                    resolve(true);
                  } else {
                    resolve(false);
                  }
                  imap.end();
                }
              });
            });
          });

          f.once('end', () => {
            if (results.length === 0) {
              imap.end();
              resolve(false);
            }
          });
        });
      });
    });

    imap.once('error', (err) => reject(err));
    imap.connect();
  });
}