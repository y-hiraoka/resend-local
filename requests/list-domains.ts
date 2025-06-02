import { resend } from "./resend-client";

const listedDomains = await resend.domains.list();

console.dir(listedDomains.data, { depth: null });
