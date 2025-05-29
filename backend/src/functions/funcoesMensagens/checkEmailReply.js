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
        rejectUnauthorized: false // ⚠️ desativa validação de certificado
      }
    });

    const subjectQuery = `processoSider: ${contact.processoSider}, Protocolo: ${contact.protocolo}`;

    imap.once('ready', () => {
      imap.openBox('INBOX', false, () => {
        const sinceDate = new Date();
        sinceDate.setDate(sinceDate.getDate() - 30); // últimos 30 dias
        const searchCriteria = [['SINCE', sinceDate.toDateString()]];

        imap.search(searchCriteria, (err, results) => {
          if (err || !results.length) {
            imap.end();
            return resolve(false);
          }

          const f = imap.fetch(results, { bodies: '' });

          let found = false;

          f.on('message', msg => {
            msg.on('body', stream => {
              simpleParser(stream, (err, mail) => {
                if (mail.subject && mail.subject.includes(subjectQuery)) {
                  found = true;
                }
              });
            });
          });

          f.once('end', () => {
            imap.end();
            resolve(found);
          });
        });
      });
    });

    imap.once('error', err => reject(err));
    imap.connect();
  });
}
