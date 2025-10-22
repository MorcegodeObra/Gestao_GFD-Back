import { User } from "../../../../models/users.js";
import { gerarMensagemHTML } from "../../infrastructure/utils/gerarMensagemHTML.js";

export class EmailHTMLBuilder {
  async construirMensagem(proces, contato, titulo, corpo) {
    const user = await User.findByPk(proces.userId);
    return gerarMensagemHTML(proces, contato, titulo, corpo, user);
  }
}
