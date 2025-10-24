import codigoSRE from "../services/codigoSRE.js";

export const criarCodigo = async (req, res) => {
  try {
    const codigo = await codigoSRE.create(req.body);
    res.status(201).json(codigo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const importarPlanilha = async (req, res) => {
  try {
    const codigo = await codigoSRE.importarSRE(req, res);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const editarCodigo = async (req, res) => {
  try {
    const codigo = await codigoSRE.update(req.params.id, req.body);
    res.status(200).json(codigo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const listarCodigos = async (req, res) => {
  try {
    const codigos = await codigoSRE.listAll();
    res.json(codigos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const buscarCodigo = async (req, res) => {
  try {
    const codigo = await codigoSRE.findById(req.params.id);
    if (!codigo)
      return res.status(404).json({ error: "codigo não encontrado" });
    res.json(codigo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletarCodigo = async (req, res) => {
  try {
    await codigoSRE.remove(req.params.id);
    res.json({ message: "codigo deletado com sucesso" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
