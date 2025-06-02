import { eq } from "drizzle-orm";
import { databaseClient } from "../database/client";
import { domainRecord } from "../database/schema";

export const verifyDomain = async (domainId: string): Promise<void> => {
  const verifyingRecord = await databaseClient
    .update(domainRecord)
    .set({ status: "pending" })
    .where(eq(domainRecord.domainId, domainId))
    .returning();

  verifyingRecord.forEach((record) => {
    setTimeout(
      async () => {
        await databaseClient
          .update(domainRecord)
          .set({ status: "verified" })
          .where(eq(domainRecord.id, record.id));
      },
      1000 * 20 + Math.floor(Math.random() * 1000 * 10),
    );
  });
};
