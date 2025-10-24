import XLSX from "xlsx";
import { SREDer } from "../models/codigoSRE.js";
import { sequelize } from "../config/sequelize.js";
import codigoSRE from "../repositories/codigoSRE.js";

export default {
  async create(data) {
    return await codigoSRE.create(data);
  },

  async update(id, data) {
    const existing = await codigoSRE.findById(id);
    if (!existing) throw new Error("Contato não encontrado");
    return await codigoSRE.update(id, data);
  },

  async listAll() {
    return await codigoSRE.findAll();
  },

  async findById(id) {
    return await codigoSRE.findById(id);
  },

  async remove(id) {
    const contato = await codigoSRE.findById(id);
    if (!contato) throw new Error("Contato não encontrado");
    await codigoSRE.remove(id);
  },

  async importarSRE(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado." });
      }

      const filePath = req.file.path;

      // Lê a planilha enviada
      const workbook = XLSX.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const dados = XLSX.utils.sheet_to_json(sheet);

      await sequelize.sync();

      // Percorre e insere cada linha
      for (const linha of dados) {
        const registro = {
          codigoSRE: linha["codigoSRE"] || linha["Código SRE"],
          area: linha["area"] || linha["Área"] || "SEM AREA",
          rodovia: linha["rodovia"] || linha["Rodovia"] || "SEM RODOVIA",
          decreto:
            linha["decreto"] || linha["Decreto"] || "Sem decreto encontrado",
          ano: parseInt(linha["ano"] || linha["Ano"]) || null,
          larguraFaixa:
            parseInt(linha["larguraFaixa"] || linha["Largura da Faixa (m)"]) ||
            null,
        };

        await SREDer.upsert(registro);
      }

      console.log("✅ Importação concluída!");
      res.status(200).json({ message: "Importação concluída com sucesso!" });
    } catch (error) {
      console.error("Erro ao importar planilha:", error);
      res.status(500).json({ error: "Erro ao importar planilha" });
    }
  },
};
