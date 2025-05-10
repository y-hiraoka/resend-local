import { z } from "zod";

const EnvSchema = z.object({
  SQLITE_DB_PATH: z.string().default("./resend-local.sqlite"),
});

type Env = z.input<typeof EnvSchema>;

export const env = EnvSchema.parse({
  SQLITE_DB_PATH: process.env.SQLITE_DB_PATH,
} satisfies Record<keyof Env, unknown>);
