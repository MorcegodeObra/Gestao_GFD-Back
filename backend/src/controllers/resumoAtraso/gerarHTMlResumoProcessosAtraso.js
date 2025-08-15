import { Contact } from "../../models/contato.js";

function formatarData(data) {
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

export async function gerarMensagemHTMLMultiplosProcessos(
  processos,
  titulo,
  corpo,
  user
) {
  if (!processos.length) return "";

  const contatosIds = [...new Set(processos.map((p) => p.contatoId))];
  const contatos = await Contact.findAll({
    where: { id: contatosIds },
  });
  const contatosMap = {};
  contatos.forEach((c) => {
    contatosMap[c.id] = c.name;
  });

  const now = new Date();

  const listaProcessosHTML = processos
    .sort((a, b) => {
      const nomeA = (contatosMap[a.contatoId] || "").toLowerCase();
      const nomeB = (contatosMap[b.contatoId] || "").toLowerCase();
      return nomeA.localeCompare(nomeB);
    })
    .map((p) => {
      const nomeContato = contatosMap[p.contatoId];
      const lastInterationDate = new Date(p.lastInteration);
      const diffMs = now - lastInterationDate;
      const diasAtraso = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      return `
      <li style="margin-bottom: 10px;">
        <strong>${p.processoSider}</strong><br> 
        Dias de atraso: <strong>${diasAtraso}</strong><br>
        Status: ${p.contatoStatus}<br>
        Contato: ${nomeContato} <br>
        Início do contato: <strong>${formatarData(lastInterationDate)}</strong> <br>
        Envios realizados: <strong>${p.cobrancas}</strong>
      </li>
    `;
    })
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; font-size: 13px; color: #333; border: 1px solid #ccc; border-radius: 20px; padding: 16px; max-width: 900px; margin: auto; background-color: #fff;">

      <div style="display: flex; flex-wrap: wrap; gap: 20px;">

        <!-- Coluna da lista de processos -->
        <div style="flex: 1; min-width: 300px;">
          <p style="font-weight: bold;">${titulo}</p>
          <p>Prezado: <strong>${user.userName}</strong></p>
          <p>Identificamos os seguintes processos com prazo superior a 30 dias:</p>
          <ul style="list-style-type: disc; padding-left: 20px; margin: 0;">
            ${listaProcessosHTML}
          </ul>
        </div>

        <!-- Coluna da mensagem -->
        <div style="flex: 1; min-width: 300px;">
          <p>${corpo}</p>
          <p>Permanecemos à disposição para dúvidas.</p>
          <p>
            <strong>Responsável pelo processo: </strong>${user.userName}<br>
            <strong>Email: </strong>${user.userEmail}<br>
            <strong>Contato: </strong>${user.userNumber}
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
