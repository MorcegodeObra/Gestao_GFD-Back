export class EmailMessageBuilder {
  build(processo, mensagemHtml, recipients) {
    return {
      from: `Solicitação - ${processo.processoSider} <${process.env.EMAIL_USER}>`,
      to: recipients.to.join(","),
      cc: recipients.cc.map(e => e.trim()).join(","),
      subject: `Solicitação - ${processo.processoSider}`,
      html: mensagemHtml,
    };
  }
}
