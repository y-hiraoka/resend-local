import { DomainRecord } from "../models/domain";

export function mapDomainStatus(
  records: { status: DomainRecord["status"] }[],
): DomainRecord["status"] {
  if (records.some((r) => r.status === "pending")) {
    return "pending";
  }
  if (records.some((r) => r.status === "not_started")) {
    return "not_started";
  }
  if (records.some((r) => r.status === "temporary_failure")) {
    return "temporary_failure";
  }
  if (records.some((r) => r.status === "failure")) {
    return "failure";
  }
  return "verified";
}
