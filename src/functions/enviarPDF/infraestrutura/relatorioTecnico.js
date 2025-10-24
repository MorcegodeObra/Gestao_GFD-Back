import PDFDocument from "pdfkit";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { renderHeader } from "./header.js";
import { conclusaoAprovado } from "./conclusao.js";
import { conclusaoReprovado } from "./conclusao.js";
import {
  carregarImagemRemota,
  renderAssinatura,
  renderRodape,
} from "./PdfUtils.js";
import { createWriteStream } from "fs";

export class RelatorioTecnico {
  constructor(user, anuencia, status, fotos) {
    this.user = user;
    this.anuencia = anuencia;
    this.status = status;
    this.fotos = fotos || [];
  }

  async gerarPdfBuffer() {
    const nomeArquivo = `Relatorio_${
      this.anuencia.id
    }_${new Date().getFullYear()}.pdf`;

    const doc = new PDFDocument({ size: "A4" });
    doc.pipe(createWriteStream(nomeArquivo));

    const fotosData = [];
    for (const url of this.fotos) {
      const foto = await carregarImagemRemota(url);
      fotosData.push(foto);
    }

    const buffers = [];

    const pdfPromisse = await new Promise((resolve, reject) => {
      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err) => reject(err));
      doc.on("data", buffers.push.bind(buffers));

      // === Cabeçalho ===
      renderHeader(doc);

      // === Dados principais ===
      const dataFormatada = format(new Date(), "dd 'de' MMMM 'de' yyyy", {
        locale: ptBR,
      });

      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .text(`INFORMAÇÃO: ${this.anuencia.id}/${new Date().getFullYear()}`)
        .text(`PROTOCOLO: ${this.anuencia.protocolo}`)
        .text(`INTERESSADO: ${this.anuencia.interessado}`)
        .text(`ASSUNTO: Pesquisa para anuência.`)
        .moveDown()
        .text(`LOCAL / DATA: Curitiba, ${dataFormatada}.`);

      doc.moveDown(1.5);

      // === Corpo técnico ===
      doc
        .font("Helvetica")
        .fontSize(12)
        .text(
          `O Consórcio Simemp/Neoconstec - Supervisão, na qualidade de empresa contratada para prestação de serviços especializados de engenharia de apoio ao DER-PR na Superintendência Regional Leste e em abrangência ao Contrato nº 036/2022 DOP, incumbe-se no presente de prestar informações, bem como demonstrar atendimento à solicitação feita através do protocolo nº ${this.anuencia.protocolo}.`,
          { align: "left" }
        );

      doc.moveDown(1.5);

      // === DESCRIÇÃO DA CONFRONTAÇÃO ===
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .text("Descrição da Confrontação:", { align: "justify" });
      doc.moveDown(1);

      doc
        .font("Helvetica")
        .text(
          `A propriedade confronta com a Rodovia ${this.anuencia.rodovia}, em seu lado direito. Conforme estabelecido pelo Decreto Estadual nº 5288/1985, a faixa de domínio desta rodovia possui largura total de 40 metros, sendo 20 metros para cada lado a partir do eixo central da referida rodovia.`,
          {
            align: "left",
            width:
              doc.page.width - doc.page.margins.left - doc.page.margins.right,
          }
        );

      doc.moveDown(2);

      // === Fotos ===
      if (this.fotos.length > 0) {
        doc
          .font("Helvetica-Bold")
          .text("Registro Fotográfico", { align: "center" });
        doc.moveDown(1);

        for (let i = 0; i < fotosData.length; i++) {
          const fotoData = fotosData[i];
          if (fotoData) {
            const buffer = Buffer.from(fotoData);
            try {
              doc.image(buffer, { width: 230, align: "center" });
              doc.moveDown(0.3);
              doc
                .font("Helvetica")
                .fontSize(10)
                .text(`Foto ${i + 1}`, { align: "center" });
              doc.moveDown(1);
            } catch {
              doc
                .font("Helvetica")
                .fontSize(10)
                .text(`(Falha ao renderizar imagem ${i + 1})`, {
                  align: "center",
                });
            }
          }
        }
      }

      //Quebra de folha
      doc.addPage();
      // === Conclusão ===
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .text("CONCLUSÃO", { align: "justify" });
      doc.moveDown(1);

      const textoConclusao =
        this.status === "APROVADO"
          ? conclusaoAprovado(this.anuencia.rodovia)
          : conclusaoReprovado(this.anuencia.rodovia);

      doc
        .font("Helvetica")
        .fontSize(12)
        .text(textoConclusao, { align: "justify" });

      doc.moveDown(3);

      // === Assinatura ===
      renderAssinatura(doc);

      // === Rodapé ===
      renderRodape(doc);

      doc.end();
    });

    return nomeArquivo;
  }
}
