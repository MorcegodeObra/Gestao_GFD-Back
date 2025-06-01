import Imap from 'imap';
import { simpleParser } from 'mailparser';
import dotenv from 'dotenv';

dotenv.config();

export async function checkEmailReply(contact) {
  return new Promise((resolve, reject) => {
    const imap = new Imap({
      user: process.env.EMAIL_USER,
      password: process.env.EMAIL_PASS,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: {
        rejectUnauthorized: false
      }
    });

    const subjectQuery = `Solicitação - ${contact.processoSider}`;

    imap.once('ready', () => {
      imap.openBox('INBOX', false, (err) => {
        if (err) {
          imap.end();
          return reject(err);
        }

        const sinceDate = new Date();
        sinceDate.setDate(sinceDate.getDate() - 30);

        const searchCriteria = [['SINCE', sinceDate.toDateString()]];

        imap.search(searchCriteria, (err, results) => {
          if (err || !results.length) {
            imap.end();
            return resolve(false);
          }

          let found = false;
          let messagesProcessed = 0;

          const f = imap.fetch(results, { bodies: '' });

          f.on('message', (msg) => {
            msg.on('body', (stream) => {
              simpleParser(stream, (err, mail) => {
                messagesProcessed++;
                if (!found && mail.subject && mail.subject.includes(subjectQuery)) {
                  found = true;
                }

                // Quando todos os emails forem processados, resolve
                if (messagesProcessed === results.length) {
                  imap.end();
                  resolve(found);
                }
              });
            });
          });

          // Caso não venha nenhuma mensagem (proteção extra)
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

