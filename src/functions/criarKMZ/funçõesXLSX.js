import utm from "utm";
import XLSX from "xlsx";

export async function lerPlanilha(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet);
}

export async function gerarKmlCompleto(linhas, nomeArquivo) {
  let placemarks = "";

  for (const linha of linhas) {
    const { Pontos, UTM_E, UTM_N } = linha;

    if (!UTM_E || !UTM_N) continue;

    // converte UTM -> Lat/Lon (WGS84)
    const { latitude, longitude } = utm.toLatLon(
      parseFloat(UTM_E),
      parseFloat(UTM_N),
      22,
      "J"
    );

    placemarks += `
    <Placemark>
      <name>${Pontos}</name>
      <Point><coordinates>${longitude},${latitude},0</coordinates></Point>
    </Placemark>`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${nomeArquivo}</name>
    ${placemarks}
  </Document>
</kml>`;
}