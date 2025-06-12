function formatarData(data) {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0'); // Mês em JavaScript é 0-indexed
  const ano = data.getFullYear();

  return `${dia}/${mes}/${ano}`;
}

export async function gerarMensagemHTML(proces, contato, titulo, corpo) {
  return `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
      <h2 style="color: #004080;">${titulo}</h2>
      
      <p>Prezado(a) <strong>${contato.name}</strong>,</p>


      <p><strong>Há um processo em andamento referente à ocupação de Faixa de Domínio:</strong><br></p>
      <p>Processo: ${proces.processoSider}<br>
      Rodovia: "${proces.rodovia}".<br>
      Status do processo: "${proces.contatoStatus}".<br>
      Início do contato: ${formatarData(proces.lastInteration)}<br>
      Ultima mensagem anexada: <strong>${proces.subject}</strong></p>

      <p>${corpo}</p>

      <p>Atenciosamente,<br>

      <hr style="margin: 30px 0;">

      <div style="text-align: center;">
        <img src="https://apismartreport.s3.sa-east-1.amazonaws.com/fotos/LogosEmpresa/icon.png" alt="Logo da Empresa" style="max-width: 150px; margin-bottom: 10px;">
        <p style="font-size: 14px; color: #666;">"Transformando ideias em sonhos realizados!""</p>
      </div>
    </div>
  `;
}
