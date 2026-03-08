import fs from "fs";
import path from "path";
import axios from "axios";

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

export async function loopFotos(campoFoto = [], variavelFotos) {
  if (!Array.isArray(campoFoto)) return [];

  const caminhosImagens = await Promise.all(
    campoFoto.map((url) => baixarImagem(url))
  );

  for (let i = 0; i < caminhosImagens.length; i += 2) {
    variavelFotos.push({
      img1: caminhosImagens[i],
      img2: caminhosImagens[i + 1] || null,
      legenda1: `Foto ${i + 1}`,
      legenda2: caminhosImagens[i + 1] ? `Foto ${i + 2}` : "",
    });
  }

  return caminhosImagens;
}
