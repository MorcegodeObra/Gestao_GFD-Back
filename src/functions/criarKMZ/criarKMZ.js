import fs from "fs";
import path from "path";
import XLSX from "xlsx";
import archiver from "archiver";
import { enviarEmail } from "../../config/funcoesEmail.js";
import { User } from "../../models/users.js";
import crypto from "crypto";
import { gerarKmlCompleto, lerPlanilha } from "./funçõesXLSX.js";

export async function gerarEEnviarKmz(req, res) {
  const { userId } = req.body;
  const arquivo = req.file;
  let tempDir = null;

  try {
    const user = await User.findByPk(userId);
    if (!arquivo || !user) {
      return res
        .status(400)
        .json({ error: "Arquivo e email são obrigatórios" });
    }

    // 📁 Cria diretório temporário único
    const tempBase = path.resolve("temp");
    const uniqueId = crypto.randomUUID();
    tempDir = path.join(tempBase, uniqueId);
    fs.mkdirSync(tempDir, { recursive: true });

    // 📑 Lê todas as linhas da planilha
    const linhas = await lerPlanilha(arquivo.path);

    // 📄 Gera o conteúdo KML completo
    const nomeArquivo = path.parse(arquivo.originalname).name;
    const kmlPath = path.join(tempDir, `${nomeArquivo}.kml`);
    const kmzPath = path.join(tempDir, `${nomeArquivo}.kmz`);

    fs.writeFileSync(
      kmlPath,
      await gerarKmlCompleto(linhas, nomeArquivo),
      "utf-8"
    );

    // 📦 Compacta em KMZ
    await new Promise((resolve, reject) => {
      const output = fs.createWriteStream(kmzPath);
      const archive = archiver("zip", { zlib: { level: 9 } });

      output.on("close", resolve);
      archive.on("error", reject);

      archive.pipe(output);
      archive.file(kmlPath, { name: `${nomeArquivo}.kml` });
      archive.finalize();
    });

    // 📧 Envia um único arquivo KMZ
    const kmzFiles = [{ filename: `Protocolo - ${nomeArquivo}.kmz`, path: kmzPath }];
    const from = `KMZ - ${XLSX.readFile(arquivo.path).SheetNames[0]} ${
      process.env.EMAIL_USER
    }`;
    const subject = nomeArquivo;
    const body =
      "Segue em anexo o arquivo KMZ com os pontos da sua solicitação.";
    await enviarEmail(from, user.userEmail, null, subject, body, kmzFiles);

    res.status(200).json({ message: "KMZ enviado por e-mail com sucesso." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao gerar ou enviar KMZ." });
  } finally {
    // 🧼 Limpa o diretório temporário inteiro
    try {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
      if (arquivo?.path) fs.unlinkSync(arquivo.path);
    } catch (cleanupErr) {
      console.warn("Erro ao limpar arquivos temporários:", cleanupErr);
    }
  }
}
