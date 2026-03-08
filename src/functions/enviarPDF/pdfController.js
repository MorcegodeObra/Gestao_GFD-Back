import { ControllerParecer } from "./pdfHandler.js";
import { User } from "../../models/users.js";
import { Anuencia } from "../../models/protocoloAnuencia.js";
import { SREDer } from "../../models/codigoSRE.js";

const controllerParecer = new ControllerParecer();

export async function controladorRelatorio(req, res) {
  try {
    const anuencia = await Anuencia.findByPk(req.body.id);
    const sreDer = await SREDer.findByPk(anuencia.codigoSRE);
    const user = await User.findByPk(anuencia.userId);
    await controllerParecer.controladorPDF(anuencia, user, sreDer);
    res.status(201).json("Sucesso ao enviar o relatório");
  } catch (error) {
    res.status(500).json(`Erro ao enviar o relatório ${error}`);
    return;
  }
}
