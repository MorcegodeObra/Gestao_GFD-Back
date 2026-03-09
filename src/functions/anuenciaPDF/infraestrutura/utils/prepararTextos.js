import {
  funcTextoAnaliseMaterial,
  funcTextoAnaliseVistoria,
  funcTextoConclusao,
} from "./textoPadroes.js";

export function prepararTextos(anuencia) {
  const textoAnaliseMaterial = funcTextoAnaliseMaterial(
    anuencia.verticesConfrontantes,
    anuencia.analiseMaterial
  );

  const textoAnaliseVistoria = funcTextoAnaliseVistoria(
    anuencia.invasoesFaixa,
    anuencia.vistoriaCampo
  );

  const conclusao = funcTextoConclusao(
    anuencia.analiseMaterial,
    anuencia.vistoriaCampo
  );

  return {
    textoAnaliseMaterial,
    textoAnaliseVistoria,
    conclusao,
  };
}