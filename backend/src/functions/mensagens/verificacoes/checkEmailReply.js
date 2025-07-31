import Imap from 'imap';
import { simpleParser } from 'mailparser';
import dotenv from 'dotenv';
import { Contact } from '../../../models/contato.js';
import extractReplyBody from "./extrairCorpoEmail.js";
import { ContactEmail } from '../../../models/contactEmail.js'; // importe o modelo se ainda não tiver feito

dotenv.config();

async function getContatoById(id) {
  const contato = await Contact.findByPk(id, {
    include: [{ model: ContactEmail }],
  });

  if (!contato) return null;

  // Coletar os e-mails
  const emails = contato.ContactEmails?.map(c => c.email) || [];

  // Retornar objeto com e-mails
  return {
    ...contato.toJSON(),
    email: emails,
  };
}


export async function checkEmailReply(proces) {
  return new Promise(async (resolve, reject) => {
    const contato = await getContatoById(proces.contatoId);
    if (!contato?.email) return resolve(false);

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
      ? contato.email.map(e => e.trim().toLowerCase())
      : [contato.email.trim().toLowerCase()];

    const subjectQuery = `Solicitação - ${proces.processoSider}`;
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - 30);

    imap.once('ready', () => {
      imap.openBox('INBOX', false, (err) => {
        if (err) {
          imap.end();
          return reject(err);
        }

        const formatDate = (date) =>
          date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }).replace(/ /g, '-');

        imap.search([['SINCE', formatDate(sinceDate)]], (err, results) => {
          if (err || !results.length) {
            imap.end();
            return resolve(false);
          }

          const f = imap.fetch(results, { bodies: '' });

          let latestMsgDate = null;
          let latestMsgText = null;
          const parsePromises = [];

          f.on('message', (msg) => {
            parsePromises.push(new Promise((resolveMsg) => {
              msg.on('body', (stream) => {
                simpleParser(stream, (err, mail) => {
                  const from = (mail.from?.value?.[0]?.address || '').toLowerCase();
                  const subject = mail.subject || '';
                  const date = mail.date;

                  const normalizedSubject = subject.replace(/^re:\s*/i, '').trim().toLowerCase();

                  if (emailsContato.includes(from) && normalizedSubject.includes(subjectQuery.toLowerCase())) {
                    if (!latestMsgDate || date > latestMsgDate) {
                      latestMsgDate = date;
                      latestMsgText = mail.text || mail.html || null;
                    }
                  }
                  resolveMsg();
                });
              });
            }));
          });

          f.once('end', async () => {
            await Promise.all(parsePromises);
            if (latestMsgText) {
              const mensagemLimpa = extractReplyBody(latestMsgText);
              proces.answer = true;
              proces.answerDate = latestMsgDate;
              proces.answerMsg = mensagemLimpa;
              proces.contatoStatus = "AGUARDANDO DER"
              await proces.save();
              resolve(true);
            } else {
              resolve(false);
            }
            imap.end();
          });
        });
      });
    });

    imap.once('error', (err) => reject(err));
    imap.connect();
  });
}