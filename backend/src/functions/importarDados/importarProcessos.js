import fs from 'fs';
import pkg from 'xlsx';
const { readFile, utils } = pkg;

import { Process } from '../../models/processo.js';

const CAMPOS_OBRIGATORIOS = ['processoSider', 'protocolo', 'userId', 'contatoId', 'subject'];

function parseDateSafe(value) {
    if (!value) return null;

    if (Object.prototype.toString.call(value) === '[object Date]') {
        return isNaN(value.getTime()) ? null : value; // já é Date
    }

    if (typeof value === 'number') {
        // Excel serial number
        const epoch = new Date(Date.UTC(1899, 11, 30));
        return new Date(epoch.getTime() + value * 86400 * 1000);
    }

    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? null : parsed;
}


export async function importarPlanilhaProcessos(filePath) {
    try {
        const workbook = readFile(filePath);
        const sheet = workbook.Sheets['ADICIONAR'];
        const data = utils.sheet_to_json(sheet, { defval: null });

        // Validação de cabeçalho
        const colunas = Object.keys(data[0] || {});
        const faltando = CAMPOS_OBRIGATORIOS.filter(campo => !colunas.includes(campo));
        if (faltando.length > 0) {
            throw new Error(`Campos obrigatórios ausentes no cabeçalho: ${faltando.join(', ')}`);
        }

        let criados = 0;
        let atualizados = 0;
        let ignorados = 0;

        for (const row of data) {
            const processoSiderOriginal = row['processoSider'];
            if (!processoSiderOriginal) continue;

            const processoSider = processoSiderOriginal.trim();
            const existente = await Process.findOne({ where: { processoSider } });
            const lastSentDate = parseDateSafe(row['lastSent']);

            if (existente) {
                await existente.update({
                    protocolo: row['protocolo'] || existente.protocolo,
                    area: row['area'] || existente.area,
                    subject: row['subject'] || existente.subject,
                    userId: row['userId'] || existente.userId,
                    contatoId: row['contatoId'] || existente.contatoId,
                    priority: row['priority'] || existente.priority,
                    contatoStatus: row['contatoStatus'] || existente.contatoStatus,
                    lastSent: lastSentDate || existente.lastSent,
                    lastInteration: lastSentDate || existente.lastInteration,
                    answerMsg: row['answerMsg'] || existente.answerMsg,
                    answerDate: row['answerDate'] ? new Date(row['answerDate']) : existente.answerDate,
                    answer: row['answer'] === true || row['answer'] === 'true',
                    check: row['check'] === true || row['check'] === 'true',
                    executed: row['executed'] === true || row['executed'] === 'true',
                    rodovia: row['rodovia'] || existente.rodovia,
                });
                atualizados++;
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
                    lastSent: lastSentDate || new Date(),
                    lastInteration: lastSentDate || new Date(),
                    answerMsg: row['answerMsg'] || null,
                    answerDate: row['answerDate'] ? new Date(row['answerDate']) : null,
                    answer: row['answer'] === true || row['answer'] === 'true',
                    check: row['check'] === true || row['check'] === 'true',
                    executed: row['executed'] === true || row['executed'] === 'true',
                    rodovia: row['rodovia'] || '',
                });
                criados++;
            } catch (err) {
                console.error(`Erro ao criar processo ${processoSider}:`, err.message);
                ignorados++;
            }
        }

        return { criados, atualizados, ignorados };
    } finally {
        // Apagar o arquivo após a execução, mesmo se der erro
        fs.unlinkSync(filePath);
    }
}
