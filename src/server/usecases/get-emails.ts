import { asc, count, desc, eq } from "drizzle-orm";
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

type GetEmailsParams = {
  offset: number;
  limit: number;
};

export type GetEmailsResult = {
  total: number;
  next: number | null;
  prev: number | null;
  emails: Email[];
};

export const getEmails = async (
  params: GetEmailsParams,
): Promise<GetEmailsResult> => {
  const [selected, [counted]] = await databaseClient.batch([
    databaseClient.query.email.findMany({
      limit: params.limit + 1,
      offset: params.offset * params.limit,
      orderBy: desc(email.createdAt),
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
    }),

    databaseClient.select({ total: count() }).from(email),
  ]);

  return {
    total: counted.total,
    next: selected.length > params.limit ? params.offset + 1 : null,
    prev: params.offset > 0 ? params.offset - 1 : null,
    emails: selected.slice(0, params.limit).map((email) => ({
      id: email.id,
      from: email.from,
      to: email.to.map((to) => to.to),
      subject: email.subject,
      cc: email.cc.map((cc) => cc.cc),
      bcc: email.bcc.map((bcc) => bcc.bcc),
      replyTo: email.replyTo.map((replyTo) => replyTo.replyTo),
      html: email.html,
      text: email.text,
      headers: email.headers,
      scheduledAt: email.scheduledAt?.toISOString() ?? null,
      attachments: email.attachments.map((attachment) => ({
        id: attachment.id,
        filename: attachment.filename,
        contentType: attachment.contentType,
      })),
      createdAt: email.createdAt.toISOString(),
      updatedAt: email.updatedAt.toISOString(),
      lastEvent: "delivered",
    })),
  };
};
