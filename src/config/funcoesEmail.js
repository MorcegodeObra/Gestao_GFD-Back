import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function enviarEmail(
  from,
  to,
  cc,
  subject,
  body,
  attachments
) {
  if (!attachments) attachments = [];
  if (!cc) cc = undefined;

  await transporter.sendMail({
    from,
    to,
    cc,
    subject,
    html: body,
    attachments,
  });
}