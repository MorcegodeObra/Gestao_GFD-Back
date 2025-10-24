import fs from "fs";
import path from "path";

export function renderHeader(doc) {
  const logoPath = path.resolve("src/public/imagensSTD/logo.png");

  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 40, { width: 90 });
  }

  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .text("Consórcio Supervisão – Regional Leste", 150, 45)
    .font("Helvetica")
    .text("E-mail: consorcio_supervisao@simemp.com.br", 150, 60)
    .text("Tel.: (41) 3361-2000", 150, 75)
    .text("Endereço: Rua Konrad Adenauer, 41 CEP 82821-020", 150, 90)
    .text("Curitiba, PR.", 150, 105);

  doc.moveTo(50, 130).lineTo(550, 130).strokeColor("#000").stroke();
  doc.moveDown(2);
}
