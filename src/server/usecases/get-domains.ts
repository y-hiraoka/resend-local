import { count, desc } from "drizzle-orm";
import { databaseClient } from "../database/client";
import { Domain } from "../models/domain";
import { domain } from "../database/schema";
import { mapDomainStatus } from "../lib/map-domain-status";

type GetDomainsParams = {
  offset: number;
  limit: number;
};

export type GetDomainsResult = {
  total: number;
  next: number | null;
  prev: number | null;
  domains: Domain[];
};

export const getDomains = async (
  params: GetDomainsParams,
): Promise<GetDomainsResult> => {
  const [selected, [counted]] = await databaseClient.batch([
    databaseClient.query.domain.findMany({
      limit: params.limit + 1,
      offset: params.offset * params.limit,
      orderBy: desc(domain.createdAt),
      with: {
        records: true,
      },
    }),

    databaseClient.select({ total: count() }).from(domain),
  ]);

  return {
    total: counted.total,
    next: selected.length > params.limit ? params.offset + 1 : null,
    prev: params.offset > 0 ? params.offset - 1 : null,
    domains: selected.slice(0, params.limit).map((domain) => ({
      id: domain.id,
      name: domain.name,
      region: domain.region,
      createdAt: domain.createdAt.toISOString(),
      status: mapDomainStatus(domain.records),
      records: domain.records.map((record) => ({
        record: record.record,
        name: record.name,
        type: record.type,
        status: record.status,
        value: record.value,
        ttl: record.ttl,
        priority: record.priority ?? undefined,
      })),
    })),
  };
};
