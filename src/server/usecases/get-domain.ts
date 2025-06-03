import { eq } from "drizzle-orm";
import { databaseClient } from "../database/client";
import { Domain } from "../models/domain";
import { domain } from "../database/schema";
import { mapDomainStatus } from "../lib/map-domain-status";

export const getDomain = async (domainId: string): Promise<Domain | null> => {
  const selected = await databaseClient.query.domain.findFirst({
    where: eq(domain.id, domainId),
    with: {
      records: true,
    },
  });

  if (!selected) {
    return null;
  }

  return {
    id: selected.id,
    name: selected.name,
    region: selected.region,
    createdAt: selected.createdAt.toISOString(),
    status: mapDomainStatus(selected.records),
    records: selected.records.map((record) => ({
      record: record.record,
      name: record.name,
      type: record.type,
      status: record.status,
      value: record.value,
      ttl: record.ttl,
      priority: record.priority ?? undefined,
    })),
  };
};
