import isFQDN from "validator/lib/isFQDN";
import { databaseClient } from "../database/client";
import { domain, domainRecord } from "../database/schema";
import { Domain } from "../models/domain";
import { Region } from "../models/region";
import { isUniqueError } from "../lib/is-unique-error";
import { generateId } from "@/lib/generate-id";

type CreateDomainPayload = {
  name: string;
  region: Region;
};

type CreateDomainErrorReason = "domain_already_exists" | "invalid_domain_name";

type CreateDomainResult =
  | {
      success: true;
      domain: Domain;
    }
  | {
      success: false;
      reason: CreateDomainErrorReason;
    };

export const createDomain = async (
  payload: CreateDomainPayload,
): Promise<CreateDomainResult> => {
  if (!isFQDN(payload.name)) {
    return {
      success: false,
      reason: "invalid_domain_name",
    };
  }

  const dkimRecord = `v=DKIM1; p=${generateId(32)}`;
  const spfRecord = `v=spf1 include:spf.invalid -all`;
  const mxRecord = `feedback-smtp.${payload.region}.invalid`;

  try {
    return await databaseClient.transaction(async (tx) => {
      const [createdDomain] = await tx
        .insert(domain)
        .values({
          name: payload.name,
          region: payload.region,
        })
        .returning();

      const [createdMxRecord, createdSpfRecord, createdDkimRecord] = await tx
        .insert(domainRecord)
        .values([
          {
            domainId: createdDomain.id,
            record: "SPF",
            name: "send",
            type: "MX",
            status: "not_started",
            value: mxRecord,
            ttl: "Auto",
            priority: 10,
          },
          {
            domainId: createdDomain.id,
            record: "SPF",
            name: "send",
            type: "TXT",
            status: "not_started",
            value: spfRecord,
            ttl: "Auto",
          },
          {
            domainId: createdDomain.id,
            record: "DKIM",
            name: "resend._domainkey",
            type: "TXT",
            status: "not_started",
            value: dkimRecord,
            ttl: "Auto",
            priority: null,
          },
        ])
        .returning();

      return {
        success: true,
        domain: {
          id: createdDomain.id,
          name: createdDomain.name,
          status: "not_started",
          createdAt: createdDomain.createdAt.toISOString(),
          region: createdDomain.region,
          records: [
            {
              record: createdMxRecord.record,
              name: createdMxRecord.name,
              type: createdMxRecord.type,
              status: createdMxRecord.status,
              ttl: createdMxRecord.ttl,
              priority: createdMxRecord.priority ?? undefined,
              value: createdMxRecord.value,
            },
            {
              record: createdSpfRecord.record,
              name: createdSpfRecord.name,
              type: createdSpfRecord.type,
              status: createdSpfRecord.status,
              ttl: createdSpfRecord.ttl,
              priority: createdSpfRecord.priority ?? undefined,
              value: createdSpfRecord.value,
            },
            {
              record: createdDkimRecord.record,
              name: createdDkimRecord.name,
              type: createdDkimRecord.type,
              status: createdDkimRecord.status,
              ttl: createdDkimRecord.ttl,
              priority: createdDkimRecord.priority ?? undefined,
              value: createdDkimRecord.value,
            },
          ],
        } satisfies Domain,
      };
    });
  } catch (error) {
    if (isUniqueError(error)) {
      return {
        success: false,
        reason: "domain_already_exists",
      };
    }

    throw error;
  }
};
