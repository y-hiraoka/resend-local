import { eq } from "drizzle-orm";
import { databaseClient } from "../database/client";
import { emailAttachment } from "../database/schema";

export async function getAttachmentFile(attachmentId: string) {
  const selected = await databaseClient.query.emailAttachment.findFirst({
    where: eq(emailAttachment.id, attachmentId),
  });

  return selected;
}
