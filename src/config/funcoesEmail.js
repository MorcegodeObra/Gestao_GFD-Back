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
  if (!Array.isArray(attachments)) attachments = [];
  if (!Array.isArray(cc)) cc = undefined;

  // Converte apenas content inválido, mantém path
  attachments = attachments.map((att) => {
    if (att.path) return att;

    let content = att.content;
    if (Array.isArray(content)) content = content.join("\n");
    else if (typeof content !== "string" && !(content instanceof Buffer))
      content = String(content);

    return { ...att, content };
  });

  await transporter.sendMail({
    from,
    to,
    cc,
    subject,
    html: body,
    attachments,
  });
}
