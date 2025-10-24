import anuenciaService from "../services/anuencia.js";

export const novaAnuencia = async (req, res) => {
  try {
    const nova = await anuenciaService.criar(req.body);
    res.status(201).json(nova);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const listarAnuencias = async (req, res) => {
  try {
    const lista = await anuenciaService.listar(req.query);
    res.json(lista);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listarIdAnuencias = async (req, res) => {
  try {
    const protocolo = await anuenciaService.buscarPorId(req.params.id);
    if (!protocolo) return res.status(404).json({ error: "Protocolo não encontrado" });
    res.json(protocolo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const editarAnuencia = async (req, res) => {
  try {
    const atualizado = await anuenciaService.editar(req.params.id, req.body);
    res.json(atualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deletarAnuencia = async (req, res) => {
  try {
    await anuenciaService.deletar(req.params.id);
    res.json({ message: "Protocolo deletado com sucesso" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
