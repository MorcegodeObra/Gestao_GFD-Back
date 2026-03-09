import fs from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ImageModule from "docxtemplater-image-module-free";

import { imageOpts } from "./geral.js";
import { validarDadosRelatorio } from "./validarDadosRelatorio.js";
import { prepararImagens, limparImagens } from "./prepararImagens.js";
import { prepararTextos } from "./prepararTextos.js";

export async function gerarDocx(
  anuencia,
  sreDer,
  fotosMaterialReq,
  fotosObraReq
) {
  validarDadosRelatorio(anuencia, sreDer);

  const templatePath = "src/templates/relatorio.docx";
  const content = fs.readFileSync(templatePath, "binary");

  const dataFormatada = format(new Date(), "dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });

  const { fotosMaterial, fotosObra, todasImagens } =
    await prepararImagens(fotosMaterialReq, fotosObraReq);

  const { textoAnaliseMaterial, textoAnaliseVistoria, conclusao } =
    prepararTextos(anuencia);

  const zip = new PizZip(content);

  const doc = new Docxtemplater(zip, {
    modules: [new ImageModule(imageOpts)],
    paragraphLoop: true,
    linebreaks: true,
  });

  const larguraCalculada = sreDer.larguraFaixa / 2;

  doc.render({
    numeroInformacao: anuencia.informacao,
    data: dataFormatada,
    protocolo: anuencia.protocolo,
    interessado: anuencia.interessado,
    assunto: anuencia.assunto,
    tipoAnuencia: anuencia.tipoAnuencia,
    rodovia: anuencia.rodovia,
    codigoSRE: anuencia.codigoSRE,
    lado: anuencia.ladoDaAnuencia,
    deLocal: sreDer.de,
    paraLocal: sreDer.para,
    decreto: sreDer.decreto,
    anoSRE: sreDer.ano,
    larguraTotal: sreDer.larguraFaixa,
    larguraCalculada,
    dataVistoria: format(new Date(anuencia.dataVistoria), "dd/MM/yyyy"),
    folhasMaterial: anuencia.folhasMaterial,
    textoAnaliseMaterial,
    textoAnaliseVistoria,
    fotosMaterial,
    fotosObra,
    conclusao,
  });

  const buffer = doc.toBuffer();

  const output = `Informação ${anuencia.informacao}.docx`;

  fs.writeFileSync(output, buffer);

  limparImagens(todasImagens);

  return output;
}