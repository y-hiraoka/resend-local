import { asc, eq } from "drizzle-orm";
import { databaseClient } from "../database/client";
import {
  email,
  emailAttachment,
  emailBcc,
  emailCc,
  emailReplyTo,
  emailTo,
} from "../database/schema";
import { Email } from "../models/email";

export const getEmail = async (emailId: string): Promise<Email | null> => {
  const selected = await databaseClient.query.email.findFirst({
    where: eq(email.id, emailId),
    with: {
      to: { orderBy: asc(emailTo.order) },
      cc: { orderBy: asc(emailCc.order) },
      bcc: { orderBy: asc(emailBcc.order) },
      replyTo: { orderBy: asc(emailReplyTo.order) },
      attachments: {
        orderBy: asc(emailAttachment.order),
        columns: {
          id: true,
          filename: true,
          contentType: true,
        },
      },
    },
  });

  if (!selected) {
    return null;
  }

  return {
    id: selected.id,
    from: selected.from,
    to: selected.to.map((to) => to.to),
    subject: selected.subject,
    cc: selected.cc.map((cc) => cc.cc),
    bcc: selected.bcc.map((bcc) => bcc.bcc),
    replyTo: selected.replyTo.map((replyTo) => replyTo.replyTo),
    html: selected.html,
    text: selected.text,
    headers: selected.headers,
    scheduledAt: selected.scheduledAt?.toISOString() ?? null,
    attachments: selected.attachments.map((attachment) => ({
      id: attachment.id,
      filename: attachment.filename,
      contentType: attachment.contentType,
    })),
    createdAt: selected.createdAt.toISOString(),
    updatedAt: selected.updatedAt.toISOString(),
  };
};
