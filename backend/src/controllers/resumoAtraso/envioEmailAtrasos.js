import { transporter } from "../../config/funcoesEmail.js";

function formatarData(data) {
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

export async function enviarResumoAtraso(message, user) {
  try {
    const agora = formatarData(new Date());
    let ccList = [user.userEmail];

    const mailOptions = {
      from: `Processos em atraso - ${agora} <${process.env.EMAIL_USER}>`,
      to: ccList,
      subject: `Processos em atraso - ${agora}`,
      html: message,
    };

    await transporter.sendMail(mailOptions);
    return `Resumo enviado para ${ccList}`;
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error.message);
  }
}
