import { EmailRecipientsService } from "./emailRecipientsService.js";
import { EmailMessageBuilder } from "./emailMessageBuilder.js";
import { EmailSender } from "./emailSender.js";

export async function sendEmailMessage(processo, now, mensagemHtml, contato) {
  const recipientsService = new EmailRecipientsService();
  const messageBuilder = new EmailMessageBuilder();
  const sender = new EmailSender();

  const recipients = await recipientsService.getRecipients(processo, contato);

  const message = messageBuilder.build(processo, mensagemHtml, recipients);
  await sender.send(message);
}
