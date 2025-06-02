import { eq } from "drizzle-orm";
import { databaseClient } from "../database/client";
import { domain } from "../database/schema";

export const deleteDomain = async (domainId: string): Promise<void> => {
  await databaseClient.delete(domain).where(eq(domain.id, domainId));
};
