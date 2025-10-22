import { formatarData } from "../utils/formatarData.js";

export function gerarMensagemHTML(proces, contato, titulo, corpo, user) {
  return `
  <div style="font-family: Arial, sans-serif; font-size: 13px; color: #333; border: 1px solid #ccc; border-radius: 20px; padding: 12px; max-width: 700px; margin: auto; background-color: #fff;">
    <div style="display: flex; text-align:flex-start; margin-bottom: 16px;">
      <div>
        <p style="font-weight: bold;">${titulo}</p>
        <p style="margin: 4px 0 0 0;">Processo: <strong>${proces.processoSider}</strong></p>
        <p>Prezado: <strong>${contato.name}</strong></p>
        <p style="margin-right: 12px;">
          Há um processo em andamento referente à ocupação de Faixa de Domínio:<br><br>
          Rodovia: <strong>${proces.rodovia}</strong><br>
          Status: <strong>${proces.contatoStatus}</strong><br>
          Início do contato: <strong>${formatarData(new Date(proces.lastInteration))}</strong><br>
          Quantidade de e-mails após 30 dias: <strong>${proces.cobrancas}</strong><br>
          Última mensagem anexa: <strong>${proces.subject}</strong>
        </p>
      </div>
      <div style="font-size: 13px; text-align: flex-start;">
        <p>${corpo}</p>
        <p>Permanecemos à disposição para dúvidas.</p>
        <p>
          <strong>Responsável pelo processo: </strong>${user.userName}<br>
          <strong>Email: </strong>${user.userEmail}<br>
          <strong>Contato: </strong>${user.userNumber}<br>
        </p>
        <div style="margin-top: 16px; display: flex; align-items: center; background: #f2f2f2; padding: 12px; border-radius: 10px;">
          <img src="https://apismartreport.s3.sa-east-1.amazonaws.com/fotos/LogosEmpresa/icon.png" alt="Logo Grupo Smart" style="height: 40px; margin-right: 12px;">
          <div>
            <p style="margin: 0; font-weight: bold;">Grupo Smart</p>
            <p style="margin: 0;">Transformando ideias em sonhos realizados</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
}
