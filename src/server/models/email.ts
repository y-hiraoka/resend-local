export interface Email {
  id: string;
  from: string;
  to: string[];
  subject: string;
  cc: string[];
  bcc: string[];
  replyTo: string[];
  html: string;
  text: string;
  scheduledAt: string;
}
