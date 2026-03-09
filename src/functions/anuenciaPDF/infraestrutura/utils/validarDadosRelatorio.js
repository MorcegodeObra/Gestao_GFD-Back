export function validarDadosRelatorio(anuencia, sreDer) {
  const erros = {
    anuencia: [],
    sreDer: [],
  };

  const camposAnuencia = [
    "informacao",
    "dataVistoria",
    "protocolo",
    "interessado",
    "assunto",
    "tipoAnuencia",
    "rodovia",
    "codigoSRE",
    "ladoDaAnuencia",
  ];

  for (const campo of camposAnuencia) {
    if (!anuencia?.[campo]) {
      erros.anuencia.push(campo);
    }
  }

  const camposSre = [
    "de",
    "para",
    "decreto",
    "ano",
    "larguraFaixa",
  ];

  for (const campo of camposSre) {
    if (!sreDer?.[campo]) {
      erros.sreDer.push(campo);
    }
  }

  if (erros.anuencia.length || erros.sreDer.length) {
    const error = new Error("Campos obrigatórios faltando");
    error.campos = erros;
    throw error;
  }
}