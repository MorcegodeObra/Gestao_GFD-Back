export function conclusaoAprovado(rodovia) {
  return `Após minuciosa análise das áreas adjacentes à Rodovia ${rodovia}, constatou-se que os vértices confrontantes respeitam os limites da faixa de domínio. Dessa forma, a área está em conformidade com o Decreto Estadual nº 5288/1985 e o protocolo é favorável à anuência.`;
}

export function conclusaoReprovado(rodovia) {
  return `Após minuciosa análise das áreas adjacentes à Rodovia ${rodovia}, constatou-se situação de inconformidade com o Decreto Estadual nº 5288/1985. As inconformidades detectadas referem-se à localização de estruturas dentro da faixa de domínio. Desse modo, há discordância em relação à confrontação do imóvel com este Departamento.`;
}
