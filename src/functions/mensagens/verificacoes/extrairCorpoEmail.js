import pkg from 'email-reply-parser';

const EmailReplyParser = pkg;

export default function extractReplyBody(emailBody) {
  const parser = new EmailReplyParser();
  const parsed = parser.read(emailBody);
  return parsed.getVisibleText().trim();
}
