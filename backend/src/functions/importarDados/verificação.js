import {
  importarPlanilhaProcessos
} from "./importarProcessos.js"

export async function verificacaoPlanilhas(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
        }

        const resultado = await importarPlanilhaProcessos(req.file.path);
        res.json({
            mensagem: 'Importação concluída.',
            criados: resultado.criados,
            ignorados: resultado.ignorados,
        });
    } catch (err) {
        console.error('Erro na importação:', err.message);
        res.status(400).json({ error: err.message });
    }
}