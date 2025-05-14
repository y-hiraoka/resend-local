import mime from "mime-types";
import { databaseClient } from "../database/client";
import {
  email,
  emailAttachment,
  emailBcc,
  emailCc,
  emailReplyTo,
  emailTo,
} from "../database/schema";

type SendEmailsPayload = {
  from: string;
  to: string | string[];
  subject: string;
  bcc?: string | string[];
  cc?: string | string[];
  scheduledAt?: string;
  replyTo?: string | string[];
  html?: string;
  text?: string;
  headers?: Record<string, string>;
  attachments?: {
    content?: string;
    filename?: string;
    path?: string;
    contentType?: string;
  }[];
  tags?: { name?: string; value?: string }[];
};

type SendEmailsErrorReason =
  | "attachments-fetch-failed"
  | "attachments-decode-failed"
  | "attachments-unknown";

type SendEmailsResult =
  | {
      success: true;
      emailIds: string[];
    }
  | {
      success: false;
      reason: SendEmailsErrorReason;
    };

class SendEmailsError extends Error {
  reason: SendEmailsErrorReason;

  constructor(reason: SendEmailsErrorReason) {
    super(`SendEmailsError: ${reason}`);
    this.name = "SendEmailsError";
    this.reason = reason;
  }
}

export const sendEmails = async (
  payloads: SendEmailsPayload[],
): Promise<SendEmailsResult> => {
  try {
    const insertingData = await Promise.all(
      payloads.map(async (payload) => {
        const attachments = await Promise.all(
          payload.attachments?.map(async (attachment) => {
            if (attachment.path) {
              return attachmentFromRemote(
                attachment.path,
                attachment.filename,
                attachment.contentType,
              );
            } else if (attachment.content) {
              return attachmentFromLocal(
                attachment.content,
                attachment.filename,
                attachment.contentType,
              );
            } else {
              throw new SendEmailsError("attachments-unknown");
            }
          }) ?? [],
        );

        return {
          from: payload.from,
          to: [payload.to].flat(),
          subject: payload.subject,
          bcc: [payload.bcc].flatMap((x) => x ?? []),
          cc: [payload.cc].flatMap((x) => x ?? []),
          scheduledAt: payload.scheduledAt,
          replyTo: [payload.replyTo].flatMap((x) => x ?? []),
          html: payload.html,
          text: payload.text,
          headers: payload.headers,
          attachments: attachments,
        };
      }),
    );

    const transactionResult = await databaseClient.transaction(async (tx) => {
      const emailIds = [];

      for (const payload of insertingData) {
        const [insertedEmail] = await tx
          .insert(email)
          .values({
            from: payload.from,
            subject: payload.subject,
            text: payload.text,
            html: payload.html,
            scheduledAt: payload.scheduledAt
              ? new Date(payload.scheduledAt)
              : null,
            headers: payload.headers,
          })
          .returning();

        const emailId = insertedEmail.id;

        await tx
          .insert(emailTo)
          .values(payload.to.map((to, order) => ({ emailId, to, order })));

        if (payload.cc.length > 0) {
          await tx
            .insert(emailCc)
            .values(payload.cc.map((cc, order) => ({ emailId, cc, order })));
        }

        if (payload.bcc.length > 0) {
          await tx
            .insert(emailBcc)
            .values(payload.bcc.map((bcc, order) => ({ emailId, bcc, order })));
        }

        if (payload.replyTo.length > 0) {
          await tx.insert(emailReplyTo).values(
            payload.replyTo.map((replyTo, order) => ({
              emailId,
              replyTo,
              order,
            })),
          );
        }

        if (payload.attachments.length > 0) {
          await tx.insert(emailAttachment).values(
            payload.attachments.map((attachment, order) => ({
              emailId,
              order,
              filename: attachment.filename,
              contentType: attachment.contentType,
              content: attachment.bytes,
            })),
          );
        }

        emailIds.push(emailId);
      }
      return emailIds;
    });

    return {
      success: true,
      emailIds: transactionResult,
    };
  } catch (error) {
    if (error instanceof SendEmailsError) {
      return {
        success: false,
        reason: error.reason,
      };
    }
    throw error;
  }
};

const attachmentFromRemote = async (
  path: string,
  filename?: string,
  contentType?: string,
) => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new SendEmailsError("attachments-fetch-failed");
  }
  const buffer = await response.arrayBuffer();
  const bytes = Buffer.from(buffer);
  return {
    bytes,
    filename,
    contentType:
      contentType ||
      response.headers.get("Content-Type") ||
      mime.lookup(filename ?? "") ||
      "application/octet-stream",
  };
};

const attachmentFromLocal = (
  content: string,
  filename?: string,
  contentType?: string,
) => {
  try {
    return {
      bytes: Buffer.from(content, "base64"),
      filename,
      contentType:
        contentType ||
        mime.lookup(filename ?? "") ||
        "application/octet-stream",
    };
  } catch {
    throw new SendEmailsError("attachments-decode-failed");
  }
};
