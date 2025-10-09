import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function enviarEmail(from, to, subject, body, attachments,cc) {
  await transporter.sendMail({
    from: from,
    to: to,
    cc: cc,
    subject: subject,
    text: body,
    attachments: attachments,
  });
}