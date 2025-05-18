#! /usr/bin/env node

import { Command } from "commander";
import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import packageJson from "./app/package.json" with { type: "json" };

const program = new Command();

program
  .name("resend-local")
  .version(packageJson.version)
  .option("-p, --port <port>", "Port to run the server on", "8005")
  .parse(process.argv);

const options = program.opts();
const PORT = options.port;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATABASE_URL = "file:resend-local.sqlite";

const cwd = path.join(__dirname, "app");

const result = spawnSync("npx", ["drizzle-kit", "push", "--force"], {
  cwd: cwd,
  env: {
    ...process.env,
    DATABASE_URL: DATABASE_URL,
  },
  stdio: "inherit",
});

if (result.status !== 0) {
  console.error("❌️ Failed to push schema to the database");
  process.exit(result.status);
}

spawn("node", ["server.js"], {
  cwd: cwd,
  env: {
    ...process.env,
    PORT: PORT,
    DATABASE_URL: DATABASE_URL,
  },
  stdio: "inherit",
});
