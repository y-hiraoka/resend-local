import { count, desc } from "drizzle-orm";
import { databaseClient } from "../database/client";
import { APIKey } from "../models/api-key";
import { apiKey } from "../database/schema";
import { mapDomainStatus } from "../lib/map-domain-status";

type GetAPIKeysParams = {
  offset: number;
  limit: number;
};

export type GetAPIKeysResult = {
  total: number;
  next: number | null;
  prev: number | null;
  apiKeys: APIKey[];
};

export const getAPIKeys = async (
  params: GetAPIKeysParams,
): Promise<GetAPIKeysResult> => {
  const [selected, [counted]] = await databaseClient.batch([
    databaseClient.query.apiKey.findMany({
      limit: params.limit + 1,
      offset: params.offset * params.limit,
      orderBy: desc(apiKey.createdAt),
      with: {
        domain: {
          with: {
            records: true,
          },
        },
      },
    }),

    databaseClient.select({ total: count() }).from(apiKey),
  ]);

  return {
    total: counted.total,
    next: selected.length > params.limit ? params.offset + 1 : null,
    prev: params.offset > 0 ? params.offset - 1 : null,
    apiKeys: selected.slice(0, params.limit).map((key) => ({
      id: key.id,
      name: key.name,
      createdAt: key.createdAt.toISOString(),
      permission: key.permission,
      token: key.token,
      domain: key.domain
        ? {
            id: key.domain.id,
            name: key.domain.name,
            createdAt: key.domain.createdAt.toISOString(),
            region: key.domain.region,
            status: mapDomainStatus(key.domain.records),
            records: key.domain.records.map((record) => ({
              record: record.record,
              type: record.type,
              name: record.name,
              status: record.status,
              ttl: record.ttl,
              priority: record.priority ?? undefined,
              value: record.value,
            })),
          }
        : null,
    })),
  };
};
