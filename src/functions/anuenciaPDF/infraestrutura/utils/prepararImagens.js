import fs from "fs";
import path from "path";


export async function prepararImagens(fotosMaterialReq, fotosObraReq) {
  const fotosMaterial = [];
  const fotosObra = [];

  const caminhosMaterial = await loopFotos(fotosMaterialReq, fotosMaterial);
  const caminhosObra = await loopFotos(fotosObraReq, fotosObra);

  return {
    fotosMaterial,
    fotosObra,
    todasImagens: [...caminhosMaterial, ...caminhosObra],
  };
}

export function limparImagens(caminhos) {
  for (const img of caminhos) {
    try {
      fs.unlinkSync(img);
    } catch {
      console.warn("Erro ao apagar imagem:", img);
    }
  }
}

export async function loopFotos(campoFoto, variavelFotos) {
  if (!Array.isArray(campoFoto)) return [];

  const caminhos = [];
  const pastaTemp = "temp";

  for (let i = 0; i < campoFoto.length; i += 2) {
    const caminho1 = path.join(pastaTemp, `foto_${Date.now()}_${i}.jpg`);

    fs.writeFileSync(caminho1, campoFoto[i].buffer);

    caminhos.push(caminho1);

    let caminho2 = null;

    if (campoFoto[i + 1]) {
      caminho2 = path.join(pastaTemp, `foto_${Date.now()}_${i + 1}.jpg`);

      fs.writeFileSync(caminho2, campoFoto[i + 1].buffer);

      caminhos.push(caminho2);
    }

    variavelFotos.push({
      img1: caminho1,
      img2: caminho2,
      legenda1: `Foto ${i + 1}`,
      legenda2: caminho2 ? `Foto ${i + 2}` : "",
    });
  }

  return caminhos;
}