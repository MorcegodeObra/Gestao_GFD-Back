import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';
import archiver from 'archiver';
import nodemailer from 'nodemailer';
import { User } from '../../models/users.js';
import crypto from 'crypto';

export async function gerarEEnviarKmz(req, res) {
    const { userId } = req.body;
    const arquivo = req.file;
    let tempDir = null;
    const hoje = new Date().toLocaleDateString('pt-BR');

    try {
        const user = await User.findByPk(userId);
        if (!arquivo || !user) {
            return res.status(400).json({ error: 'Arquivo e email são obrigatórios' });
        }

        // 📁 Cria diretório temporário único
        const tempBase = path.resolve('temp');
        const uniqueId = crypto.randomUUID();
        tempDir = path.join(tempBase, uniqueId);
        fs.mkdirSync(tempDir, { recursive: true });

        const linhas = lerPlanilha(arquivo.path);
        const kmzFiles = await Promise.all(
            linhas.map(async (linha) => gerarKmzDaSolicitacao(linha, tempDir))
        );
        const nomeArquivo = XLSX.readFile(arquivo.path).SheetNames[0];
        
        await enviarEmailComAnexos(user.userEmail, kmzFiles, hoje,nomeArquivo);

        res.status(200).json({ message: 'KMZ enviado por e-mail com sucesso.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao gerar ou enviar KMZ.' });
    } finally {
        // 🧼 Limpa o diretório temporário inteiro
        try {
            if (fs.existsSync(tempDir)) {
                fs.rmSync(tempDir, { recursive: true, force: true });
            }
            if (arquivo?.path) fs.unlinkSync(arquivo.path);
        } catch (cleanupErr) {
            console.warn('Erro ao limpar arquivos temporários:', cleanupErr);
        }
    }
}

function lerPlanilha(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet);
}

function gerarKmlContent(linha) {
    const pontos = Object.keys(linha).filter(key => key !== 'Solicitação');
    let placemarks = '';

    for (const pt of pontos) {
        const coord = linha[pt];
        if (typeof coord !== 'string' || !coord.includes(',')) continue;

        const [lat, lon] = coord.split(',').map(parseFloat);
        if (isNaN(lat) || isNaN(lon)) continue;

        placemarks += `
    <Placemark>
      <name>${pt}</name>
      <Point><coordinates>${lon},${lat},0</coordinates></Point>
    </Placemark>`;
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Solicitação ${linha.Solicitação}</name>
    ${placemarks}
  </Document>
</kml>`;
}

async function gerarKmzDaSolicitacao(linha, dirPath) {
    const nome = linha.Solicitação.replace('/', '_');

    const kmlPath = path.join(dirPath, `${nome}.kml`);
    const kmzPath = path.join(dirPath, `${nome}.kmz`);

    fs.writeFileSync(kmlPath, gerarKmlContent(linha), 'utf-8');

    await new Promise((resolve, reject) => {
        const output = fs.createWriteStream(kmzPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', resolve);
        archive.on('error', reject);

        archive.pipe(output);
        archive.file(kmlPath, { name: `${nome}.kml` });
        archive.finalize();
    });

    return { filename: `${nome}.kmz`, path: kmzPath };
}

async function enviarEmailComAnexos(destinatario, arquivos, hoje,nomeArquivo) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    await transporter.sendMail({
        from: `KMZ Gerado - ${nomeArquivo} - ${hoje} ${process.env.EMAIL_USER}`,
        to: destinatario,
        subject: 'Arquivos KMZ gerados',
        text: 'Segue em anexo os arquivos KMZ com os pontos da sua solicitação.',
        attachments: arquivos
    });
}
