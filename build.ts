import { spawnSync } from "node:child_process";
import fs from "fs-extra";
import esbuild from "esbuild";

console.log("building the next app");
const buildResult = spawnSync("pnpm", ["exec", "next", "build"], {
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
  },
});

if (buildResult.status !== 0) {
  process.exit(1);
}

console.log("removing dist/app");
await fs.remove("dist/app");

console.log("copying files required for the app");
await fs.copy(".next/standalone", "dist/app");
await fs.remove("dist/app/node_modules");
await fs.copy(".next/static", "dist/app/.next/static");
await fs.copy("public", "dist/app/public");

console.log("creating sqlite database file");
const drizzlePushResult = spawnSync("pnpm", [
  "exec",
  "drizzle-kit",
  "push",
  "--dialect",
  "sqlite",
  "--schema",
  "src/server/database/schema.ts",
  "--url",
  "file:dist/app/resend-local.sqlite",
]);

if (drizzlePushResult.status !== 0) {
  console.error("Failed to run drizzle-kit push");
  process.exit(1);
}

console.log("building starter script");
esbuild.buildSync({
  entryPoints: ["src/starter.ts"],
  bundle: true,
  external: ["commander"],
  platform: "node",
  target: "node20",
  format: "esm",
  outfile: "dist/starter.js",
  banner: {
    js: `#! /usr/bin/env node`,
  },
});

console.log("done!");
