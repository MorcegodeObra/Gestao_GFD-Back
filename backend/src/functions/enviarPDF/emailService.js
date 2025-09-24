import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail(to, subject, pdfBuffer, processId) {
  await transporter.sendMail({
    from: `Relatório Gerado - ${process.env.EMAIL_USER}`,
    to,
    subject,
    text: `Segue em anexo o relatório técnico do processo ${processId}.`,
    attachments: [
      {
        filename: `relatorio-processo-${processId}.pdf`,
        content: pdfBuffer,
      },
    ],
  });
}