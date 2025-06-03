import { Region } from "./region";

export interface Domain {
  id: string;
  name: string;
  status:
    | "not_started"
    | "pending"
    | "verified"
    | "failure"
    | "temporary_failure";
  createdAt: string;
  region: Region;
  records: DomainRecord[];
}

export interface DomainRecord {
  record: string;
  type: string;
  name: string;
  status:
    | "not_started"
    | "pending"
    | "verified"
    | "failure"
    | "temporary_failure";
  ttl: string;
  priority: number | undefined;
  value: string;
}
