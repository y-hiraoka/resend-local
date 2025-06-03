import { Domain } from "./domain";

export interface APIKey {
  id: string;
  name: string;
  token: string;
  permission: "full_access" | "sending_access";
  domain: Domain | null;
  createdAt: string;
}
