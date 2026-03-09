import fs from "fs";
import path from "path";
import axios from "axios";
import libre from "libreoffice-convert";

export const imageOpts = {
  centered: true,

  getImage(tagValue, tagName, meta) {
    return fs.readFileSync(tagValue);
  },

  getSize(img) {
    return [300, 200];
  },
};

export async function baixarImagem(url, pastaDestino = "temp") {
  if (!fs.existsSync(pastaDestino)) {
    fs.mkdirSync(pastaDestino, { recursive: true });
  }

  const response = await axios.get(url, {
    responseType: "arraybuffer",
  });

  const nomeArquivo = `img_${Date.now()}.jpg`;
  const caminhoImagem = path.join(pastaDestino, nomeArquivo);

  fs.writeFileSync(caminhoImagem, response.data);

  return caminhoImagem;
}

export async function converterPDF(caminhoDocx, informacao) {
  if (!fs.existsSync(caminhoDocx)) {
    throw new Error(`Arquivo DOCX não encontrado: ${caminhoDocx}`);
  }

  const docx = fs.readFileSync(caminhoDocx);

  return new Promise((resolve, reject) => {
    libre.convert(docx, ".pdf", undefined, (err, done) => {
      if (err) {
        console.error("Erro na conversão do LibreOffice:", err);
        return reject(new Error("Falha ao converter DOCX para PDF"));
      }

      const pdfPath = `Informação ${informacao}.pdf`;

      try {
        fs.writeFileSync(pdfPath, done);
        resolve(pdfPath);
      } catch (writeErr) {
        reject(writeErr);
      }
    });
  });
}
