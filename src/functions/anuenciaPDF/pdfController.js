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

    const fotosMaterial = req.files?.fotosMaterial || [];
    const fotosObra = req.files?.fotosObra || [];

    await controllerParecer.controladorPDF(
      anuencia,
      user,
      sreDer,
      fotosMaterial,
      fotosObra,
    );

    res.status(201).json("Sucesso ao enviar o relatório");
  } catch (error) {
    if (error.campos) {
      const mensagem = `
Erro ao enviar relatório.

Campos faltantes:

PROTOCOLO: ${error.campos.anuencia.join(", ") || "nenhum"}

CODIGO SRE: ${error.campos.sreDer.join(", ") || "nenhum"}
`;

      return res.status(400).json(mensagem);
    }

    console.error(error);

    res.status(500).json("Erro interno ao enviar relatório");
  }
}
