import { resend } from "./resend-client";

const domain = await resend.domains.create({
  name: "example.comm",
  region: "ap-northeast-1",
});

console.dir(domain, { depth: null });
