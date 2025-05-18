import fs from "fs-extra";
import { spawnSync } from "node:child_process";
import esbuild from "esbuild";

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

console.log("stripping types from drizzle config and schema");
esbuild.buildSync({
  entryPoints: ["drizzle.config.ts"],
  bundle: false,
  minify: false,
  outfile: "dist/app/drizzle.config.ts",
  platform: "node",
  target: "node20",
  format: "esm",
});

esbuild.buildSync({
  entryPoints: ["src/server/database/schema.ts"],
  bundle: false,
  minify: false,
  outfile: "dist/app/src/server/database/schema.ts",
  platform: "node",
  target: "node20",
  format: "esm",
});

console.log("done!");
