import { eq } from "drizzle-orm";
import { databaseClient } from "../database/client";
import { apiKey } from "../database/schema";

export const deleteAPIKey = async (apiKeyId: string): Promise<void> => {
  await databaseClient.delete(apiKey).where(eq(apiKey.id, apiKeyId));
};
