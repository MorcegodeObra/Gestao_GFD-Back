export function funcTextoAnaliseMaterial(
  verticesConfrontantes,
  statusMaterial,
) {
  if (statusMaterial === false) {
    return `Constatou-se que os vértices ${verticesConfrontantes}, que confrontam com a rodovia, respeitam o limite da faixa de domínio estabelecido pelo decreto.\n\nDessa forma, sob o ponto de vista documental, o imóvel encontra-se em conformidade com os limites da faixa de domínio.`;
  } else {
    return `Constatou-se que os vértices ${verticesConfrontantes}, que confrontam com a rodovia, não respeitam o limite da faixa de domínio estabelecido pelo decreto.\n\nDessa forma, sob o ponto de vista documental, o imóvel encontra-se em inconformidade com os limites da faixa de domínio.`;
  }
}

export function funcTextoAnaliseVistoria(invasoesFaixa, statusMaterial) {
  if (statusMaterial === true) {
    return `Durante a inspeção em campo, constatou-se a existência de estruturas implantadas dentro da faixa de domínio da rodovia, especificamente ${invasoesFaixa}, avançando para o interior do limite legal da faixa de domínio.\n\nAs imagens registradas durante a vistoria demonstram a ocupação irregular da área pertencente à rodovia.`;
  } else {
    return `Durante a inspeção em campo, não se constatou a existência de estruturas implantadas dentro da faixa de domínio da rodovia.\n\nAs imagens registradas durante a vistoria demonstram a situação atual do imóvel em relação à faixa de domínio.`;
  }
}

export function funcTextoConclusao(analiseMaterial, vistoriaCampo) {
  if (analiseMaterial === false && vistoriaCampo === false) {
    return `Tanto a análise do material técnico apresentado quanto a vistoria realizada em campo indicam que o imóvel respeita os limites da faixa de domínio da rodovia estadual.\n\nDessa forma, não foram identificadas inconformidades em relação à ocupação da faixa de domínio, motivo pelo qual este Departamento manifesta-se favoravelmente à anuência do pedido, sob o ponto de vista técnico.`;
  } else if (analiseMaterial === true && vistoriaCampo === false) {
    return `Embora o material técnico apresentado (mapa e memorial descritivo) indique interferência nos limites da faixa de domínio, a vistoria realizada em campo não constatou a existência de estruturas físicas implantadas dentro da área pertencente à rodovia estadual.\n\nDessa forma, recomenda-se a adequação da documentação técnica apresentada, a fim de que represente fielmente a situação verificada em campo.`;
  } else if (analiseMaterial === false && vistoriaCampo === true) {
    return `Embora o material técnico apresentado esteja em conformidade com os limites legais da faixa de domínio, a vistoria realizada em campo identificou a existência de estrutura física implantada dentro da área pertencente à rodovia estadual.\n\nAssim, considerando a ocupação irregular verificada em campo, este Departamento manifesta-se de forma desfavorável à anuência do pedido até que as inconformidades identificadas sejam devidamente regularizadas.`;
  } else {
    return `Tanto a análise do material técnico apresentado quanto a vistoria realizada em campo identificaram interferências nos limites da faixa de domínio da rodovia estadual.\n\nDessa forma, considerando as inconformidades verificadas, este Departamento manifesta-se de forma desfavorável à anuência do pedido até que sejam promovidas as adequações necessárias para a regularização da situação.`;
  }
}
