import { ControllerParecer } from "./pdfHandler.js";
import { User } from "../../models/users.js";
import { Anuencia } from "../../models/protocoloAnuencia.js";

const controllerParecer = new ControllerParecer();

export async function controladorRelatorio(req, res) {
  try {
    const anuencia = await Anuencia.findByPk(req.body.id);
    const user = await User.findByPk(anuencia.userId);
    const status = req.body.status;
    const fotos = anuencia.fotos;
    await controllerParecer.controladorPDF(user, anuencia, status, fotos);
    res.status(201).json("Sucesso ao enviar o relatório");
  } catch (error) {
    res.status(500).json(`Erro ao enviar o relatório ${error}`);
    return;
  }
}
