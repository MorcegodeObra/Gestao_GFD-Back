import processService from "../services/processo.js";

export const criarProcesso = async (req, res) => {
  try {
    const process = await processService.create(req.body);
    res.status(201).json(process);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const listarProcesso = async (req, res) => {
  try {
    const processos = await processService.list(req.query);
    res.json(processos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listarIdProcesso = async (req, res) => {
  try {
    const process = await processService.findById(req.params.id);
    res.json(process);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

export const editarProcesso = async (req, res) => {
  try {
    const process = await processService.update(req.params.id, req.body);
    res.json(process);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

export const deletarProcesso = async (req, res) => {
  try {
    await processService.remove(req.params.id);
    res.json({ message: "Processo deletado com sucesso" });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

export const resumoSemanal = async (req, res) => {
  try {
    const resumo = await processService.weeklySummary(req.params.userId);
    res.json(resumo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const aceitarSolicitacao = async (req, res) => {
  try {
    const result = await processService.acceptTransfer(req.params.id, req.body.userId);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};
