import { z } from "zod";

const EnvSchema = z.object({
  DATABASE_URL: z.string().default("./resend-local.sqlite"),
});

export const env = EnvSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
} satisfies Record<keyof z.input<typeof EnvSchema>, unknown>);
