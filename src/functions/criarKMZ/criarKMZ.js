import fs from "fs";
import path from "path";
import XLSX from "xlsx";
import archiver from "archiver";
import { enviarEmail } from "../../config/funcoesEmail.js";
import { User } from "../../models/users.js";
import crypto from "crypto";
import { gerarKmlCompleto, lerPlanilha } from "./funçõesXLSX.js";

export async function gerarEEnviarKmz(req, res) {
  const { userId, fileBase64, fileName } = req.body;
  const arquivo = req.files?.arquivo; // caso venha multipart
  let tempDir = null;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(400).json({ error: "Usuário não encontrado" });

    // 🔹 Cria diretório temporário
    const tempBase = path.resolve("temp");
    const uniqueId = crypto.randomUUID();
    tempDir = path.join(tempBase, uniqueId);
    fs.mkdirSync(tempDir, { recursive: true });

    let filePath;
    if (arquivo) {
      // caso venha via multipart/form-data
      filePath = path.join(tempDir, arquivo.name);
      await arquivo.mv(filePath);
    } else if (fileBase64 && fileName) {
      // caso venha via JSON com base64
      filePath = path.join(tempDir, fileName);
      const buffer = Buffer.from(fileBase64, "base64");
      fs.writeFileSync(filePath, buffer);
    } else {
      return res
        .status(400)
        .json({ error: "Arquivo (upload ou base64) é obrigatório" });
    }

    // 📑 Lê planilha
    const linhas = await lerPlanilha(filePath);

    // 📄 Gera KML e KMZ
    const nomeArquivo = path.parse(filePath).name;
    const kmlPath = path.join(tempDir, `${nomeArquivo}.kml`);
    const kmzPath = path.join(tempDir, `${nomeArquivo}.kmz`);

    fs.writeFileSync(kmlPath, await gerarKmlCompleto(linhas, nomeArquivo));

    await new Promise((resolve, reject) => {
      const output = fs.createWriteStream(kmzPath);
      const archive = archiver("zip", { zlib: { level: 9 } });
      output.on("close", resolve);
      archive.on("error", reject);
      archive.pipe(output);
      archive.file(kmlPath, { name: `${nomeArquivo}.kml` });
      archive.finalize();
    });

    // 📧 Envia e-mail
    const attachments = [{ filename: `${nomeArquivo}.kmz`, path: kmzPath }];
    const from = `KMZ - ${XLSX.readFile(filePath).SheetNames[0]} ${process.env.EMAIL_USER}`;
    const subject = nomeArquivo;
    const body =
      "Segue em anexo o arquivo KMZ com os pontos da sua solicitação.";
    await enviarEmail(from, user.userEmail,null, subject, body, kmzFiles);

    res.status(200).json({ message: "KMZ enviado por e-mail com sucesso." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao gerar ou enviar KMZ." });
  } finally {
    try {
      if (tempDir && fs.existsSync(tempDir))
        fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (cleanupErr) {
      console.warn("Erro ao limpar arquivos temporários:", cleanupErr);
    }
  }
}