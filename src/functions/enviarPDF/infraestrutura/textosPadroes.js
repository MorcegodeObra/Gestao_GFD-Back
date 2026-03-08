import fetch from "node-fetch";

export async function carregarImagemRemota(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Erro ao baixar imagem: ${url}`);
    return await res.arrayBuffer();
  } catch (err) {
    console.warn("⚠️ Erro ao carregar imagem:", err.message);
    return null;
  }
}

export function renderAssinatura(doc) {
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text("Eng. GABRIEL SOARES DE OLIVEIRA", { align: "center" })
    .font("Helvetica")
    .text("Engenheiro Civil", { align: "center" })
    .text("ART: PR-207656/D", { align: "center" })
    .text("Consórcio Simemp/Neoconstec", { align: "center" });
}

export function renderRodape(doc) {
  doc.moveTo(50, 760).lineTo(550, 760).stroke();
  doc
    .fontSize(9)
    .text("Consórcio Supervisão – Regional Leste", 50, 770)
    .text("E-mail: consorcio_supervisao@simemp.com.br", 50, 785)
    .text("Tel.: (41) 3361-2000", 50, 800)
    .text(
      "Endereço: Rua Konrad Adenauer, 41 CEP 82821-020 Curitiba, PR.",
      50,
      815
    );
}
