import fs from 'fs';
import pkg from 'xlsx';
const { readFile, utils } = pkg;

import { Process } from '../../models/processo.js';

const CAMPOS_OBRIGATORIOS = ['processoSider', 'protocolo', 'userId', 'contatoId', 'subject'];

export async function importarPlanilhaProcessos(filePath) {
    try {
        const workbook = readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = utils.sheet_to_json(sheet, { defval: null });
        // ...continua o resto da função...

        // Validação de cabeçalho
        const colunas = Object.keys(data[0] || {});
        const faltando = CAMPOS_OBRIGATORIOS.filter(campo => !colunas.includes(campo));
        if (faltando.length > 0) {
            throw new Error(`Campos obrigatórios ausentes no cabeçalho: ${faltando.join(', ')}`);
        }

        let criados = 0;
        let ignorados = 0;

        for (const row of data) {
            const processoSiderOriginal = row['processoSider'];
            if (!processoSiderOriginal) continue;

            const processoSider = processoSiderOriginal.trim();
            
            const existente = await Process.findOne({ where: { processoSider } });
            if (existente) {
                ignorados++;
                continue;
            }

            try {
                await Process.create({
                    processoSider,
                    protocolo: row['protocolo'] || '',
                    area: row['area'] || 'SEM AREA',
                    subject: row['subject'] || '',
                    userId: row['userId'],
                    contatoId: row['contatoId'],
                    priority: row['priority'] || 'BAIXO',
                    contatoStatus: row['contatoStatus'] || 'SEM STATUS',
                    lastSent: row['lastSent'] ? new Date(row['lastSent']) : new Date(),
                    answerMsg: row['answerMsg'] || null,
                    answerDate: row['answerDate'] ? new Date(row['answerDate']) : null,
                    lastInteration: row['lastInteration'] ? new Date(row['lastInteration']) : new Date(),
                    answer: row['answer'] === true || row['answer'] === 'true',
                    check: row['check'] === true || row['check'] === 'true',
                    executed: row['executed'] === true || row['executed'] === 'true',
                });
                criados++;
            } catch (err) {
                console.error(`Erro ao criar processo ${processoSider}:`, err.message);
            }
        }

        return { criados, ignorados };
    } finally {
        // Apagar o arquivo após a execução, mesmo se der erro
        fs.unlinkSync(filePath);
    }
}
