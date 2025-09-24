import PDFDocument from "pdfkit";

export async function gerarPdfBuffer(user, process) {
  try {
    const pdfBuffer = await new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      let buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      // Cabeçalho
      doc.fontSize(18).text("Relatório Técnico", { align: "center" });
      doc.moveDown();

      // Usuário
      doc.fontSize(12).text(`Usuário: ${user.name}`);
      doc.text(`Email: ${user.email}`);
      doc.moveDown();

      // Processo
      doc.text(`Processo ID: ${process.processoSider}`);
      doc.text(`Número: ${process.protocolo}`);
      doc.text(`Área: ${process.area}`);
      doc.text(`Prioridade: ${process.priority}`);
      doc.text(`Status: ${process.contatoStatus}`);
      doc.moveDown();

      if (process.subject) {
        doc.text("Descrição do processo:");
        doc.text(process.subject, { indent: 20 });
      }

      // Finalizar PDF
      doc.end();
    });

    return pdfBuffer;
  } catch (err) {
    console.error("Erro ao gerar PDF:", err);
    throw err; // propaga o erro para ser tratado onde chamar
  }
}
