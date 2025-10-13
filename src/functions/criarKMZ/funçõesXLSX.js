import utm from "utm";
import XLSX from "xlsx";

// Função auxiliar para converter DMS (graus, minutos, segundos) → decimal
function dmsToDecimal(dmsString) {
  if (!dmsString) return null;

  const s = String(dmsString).trim().replace(",", ".");
  if (/^-?\d+(\.\d+)?$/.test(s)) return parseFloat(s); // já decimal

  // extrai números na ordem graus, minutos, segundos
  const parts = s.replace(/[^\d.\-]+/g, " ").trim().split(/\s+/).map(parseFloat);
  if (parts.length < 3) return NaN;

  const [graus, minutos, segundos] = parts;
  const decimal = Math.abs(graus) + minutos / 60 + segundos / 3600;
  return graus < 0 ? -decimal : decimal;
}

// Detecta se o valor é realmente UTM (número dentro do range 100000–999999)
function isUTM(value) {
  if (!value) return false;
  if (/[º'"°]/.test(String(value))) return false; // contém símbolo → não é UTM
  const num = parseFloat(String(value).replace(",", "."));
  return !isNaN(num) && num >= 100000 && num <= 999999;
}

export async function gerarKmlCompleto(linhas, nomeArquivo) {
  let placemarks = "";

  for (const linha of linhas) {
    const { Pontos, UTM_E, UTM_N, zoneNum } = linha;
    if (!UTM_E || !UTM_N) continue;

    let lat, lon;

    // Se contiver símbolo de grau → trata como DMS
    if (/[º'"°]/.test(String(UTM_E)) || /[º'"°]/.test(String(UTM_N))) {
      lon = dmsToDecimal(UTM_E);
      lat = dmsToDecimal(UTM_N);
    }
    // Se for UTM válido → converte
    else if (isUTM(UTM_E) && isUTM(UTM_N)) {
      const { latitude, longitude } = utm.toLatLon(
        parseFloat(UTM_E),
        parseFloat(UTM_N),
        parseInt(zoneNum || 22),
        "J"
      );
      lat = latitude;
      lon = longitude;
    }
    // Caso contrário, tenta usar como decimal direto
    else {
      lon = parseFloat(UTM_E);
      lat = parseFloat(UTM_N);
    }

    if (!isFinite(lat) || !isFinite(lon)) continue;

    placemarks += `
    <Placemark>
      <name>${Pontos || ""}</name>
      <Point><coordinates>${lon},${lat},0</coordinates></Point>
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

// Lê planilha Excel e retorna um array de objetos
export async function lerPlanilha(caminho) {
  const workbook = XLSX.readFile(caminho);
  const primeiraAba = workbook.SheetNames[0];
  const planilha = XLSX.utils.sheet_to_json(workbook.Sheets[primeiraAba]);
  return planilha;
}
