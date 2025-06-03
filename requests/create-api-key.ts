import { resend } from "./resend-client";

const randomAPIKeyName = Math.random().toString(36).substring(2, 15) + "-key";

const domains = await resend.domains.list();

const randomDomain =
  domains.data?.data[
    Math.floor(Math.random() * (domains.data?.data.length ?? 1))
  ];

const randomDomainId = Math.random() > 0.5 ? randomDomain?.id : undefined;

const created = await resend.apiKeys.create({
  name: randomAPIKeyName,
  permission: randomDomainId ? "sending_access" : "full_access",
  domain_id: randomDomainId,
});

console.dir(created, { depth: null });
