import { databaseClient } from "../database/client";
import { apiKey } from "../database/schema";
import { generateId } from "@/lib/generate-id";

type CreateAPIKeyPayload = {
  name: string;
  permission: "full_access" | "sending_access";
  domainId: string | undefined;
};
export const createAPIKey = async (
  payload: CreateAPIKeyPayload,
): Promise<{
  id: string;
  token: string;
}> => {
  const [inserted] = await databaseClient
    .insert(apiKey)
    .values({
      name: payload.name,
      token: `re_${generateId(32)}`,
      permission: payload.permission,
      domainId: payload.domainId,
    })
    .returning();

  return {
    id: inserted.id,
    token: inserted.token,
  };
};
