import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/server/database/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
});
