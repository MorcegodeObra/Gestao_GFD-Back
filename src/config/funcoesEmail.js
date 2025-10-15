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
  attachments = []
) {
  if (
    !to ||
    (Array.isArray(to) && to.length === 0) ||
    (typeof to === "string" && to.trim() === "")
  ) {
    throw new Error("Nenhum destinatário definido para o e-mail");
  }

  if (!Array.isArray(attachments)) attachments = [];
  if (!Array.isArray(cc)) cc = undefined;

  await transporter.sendMail({
    from,
    to,
    cc,
    subject,
    html: body, // HTML completo
    attachments,
  });
}
