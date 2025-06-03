import { resend } from "./resend-client";

const randomDomainName = Math.random().toString(36).substring(2, 15) + ".com";
const randomRegion = (
  ["us-east-1", "eu-west-1", "sa-east-1", "ap-northeast-1"] as const
)[Math.floor(Math.random() * 4)];

const domain = await resend.domains.create({
  name: randomDomainName,
  region: randomRegion,
});

console.dir(domain, { depth: null });

const gotDomain = await resend.domains.get(domain.data?.id ?? "");

console.dir(gotDomain, { depth: null });
