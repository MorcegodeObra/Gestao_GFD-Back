import fs from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import libre from "libreoffice-convert";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ImageModule from "docxtemplater-image-module-free";
import { imageOpts, loopFotos } from "./utilsPdf.js";
import {
  funcTextoAnaliseMaterial,
  funcTextoAnaliseVistoria,
  funcTextoConclusao,
} from "./textoPadroes.js";
import { info } from "console";

export async function gerarDocx(anuencia, sreDer) {
  const templatePath = "src/templates/relatorio.docx";
  const content = fs.readFileSync(templatePath, "binary");
  const dataFormatada = format(new Date(), "dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });

  const fotosMaterial = [];
  const fotosObra = [];

  const caminhosMaterial = await loopFotos(
    anuencia.fotosMaterial,
    fotosMaterial,
  );
  const caminhosObra = await loopFotos(anuencia.fotosObra, fotosObra);

  const todasImagens = [...caminhosMaterial, ...caminhosObra];

  const zip = new PizZip(content);

  const doc = new Docxtemplater(zip, {
    modules: [new ImageModule(imageOpts)],
    paragraphLoop: true,
    linebreaks: true,
  });
  const textoAnaliseMaterial = funcTextoAnaliseMaterial(
    anuencia.verticesConfrontantes,
    anuencia.analiseMaterial,
  );
  const textoAnaliseVistoria = funcTextoAnaliseVistoria(
    anuencia.invasoesFaixa,
    anuencia.vistoriaCampo,
  );
  const conclusao = funcTextoConclusao(
    anuencia.analiseMaterial,
    anuencia.vistoriaCampo,
  );
  const larguraCalculada = sreDer.larguraFaixa / 2;

  doc.render({
    numeroInformacao: anuencia.informacao,
    data: dataFormatada,
    protocolo: anuencia.protocolo,
    interessado: anuencia.interessado,
    assunto: anuencia.assunto,
    rodovia: anuencia.rodovia,
    codigoSRE: anuencia.codigoSRE,
    lado: anuencia.ladoDaAnuencia,
    deLocal: sreDer.de,
    paraLocal: sreDer.para,
    decretoSRE: anuencia.decretoSRE,
    larguraTotal: sreDer.larguraFaixa,
    larguraCalculada: larguraCalculada,
    dataVistoria: anuencia.dataVistoria,
    folhasMaterial: anuencia.folhasMaterial,
    textoAnaliseMaterial: textoAnaliseMaterial,
    textoAnaliseVistoria: textoAnaliseVistoria,
    fotosMaterial: fotosMaterial,
    fotosObra: fotosObra,
    conclusao: conclusao,
  });

  const buffer = doc.toBuffer();
  const output = `Informação ${anuencia.informacao}.docx`;
  fs.writeFileSync(output, buffer);

  for (const img of todasImagens) {
    try {
      fs.unlinkSync(img);
    } catch (err) {
      console.warn("Erro ao apagar imagem:", img);
    }
  }
  
  return output;
}

export async function converterPDF(caminhoDocx, informacao) {
  const docx = fs.readFileSync(caminhoDocx);

  return new Promise((resolve, reject) => {
    libre.convert(docx, ".pdf", undefined, (err, done) => {
      if (err) {
        reject(err);
        return;
      }

      const pdfPath = `Informação ${informacao}.pdf`;

      fs.writeFileSync(pdfPath, done);

      resolve(pdfPath);
    });
  });
}
