export interface Email {
  id: string;
  from: string;
  to: string[];
  subject: string;
  cc: string[];
  bcc: string[];
  replyTo: string[];
  html: string | null;
  text: string | null;
  scheduledAt: string | null;
  headers: Record<string, string> | null;
  attachments: {
    id: string;
    filename: string | null;
    contentType: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
