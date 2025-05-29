import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Command } from "commander";
import { version } from "../package.json";

const program = new Command();

program
  .name("resend-local")
  .version(version)
  .option("-p, --port <port>", "Port to run the server on", "8005")
  .parse(process.argv);

const options = program.opts();

const PORT = options.port;

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const cwd = path.join(__dirname, "app");

const DATABASE_URL = "file:resend-local.sqlite";

spawn("node", ["server.js"], {
  cwd: cwd,
  env: {
    ...process.env,
    PORT: PORT,
    DATABASE_URL: DATABASE_URL,
  },
  stdio: "inherit",
});
