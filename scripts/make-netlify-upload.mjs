#!/usr/bin/env node
/**
 * Build a clean folder for drag-and-drop deploys on Netlify:
 *
 *   npm run netlify:upload
 *
 * Creates ./netlify-upload containing only what Netlify needs to build the
 * site (source, content, public assets, config and the lockfile). It leaves
 * out node_modules (Windows-only binaries, hundreds of MB — Netlify installs
 * its own), .next (Netlify rebuilds it), local lead data (.data), secrets
 * (.env*), tests, docs and the separate coming-soon page.
 *
 * Then drag the netlify-upload folder onto your site's Deploys page.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dest = path.join(root, "netlify-upload");

const files = ["package.json", "package-lock.json", "netlify.toml", "next.config.ts", "tsconfig.json", "postcss.config.mjs"];
const dirs = ["src", "public", "content"];

fs.rmSync(dest, { recursive: true, force: true });
fs.mkdirSync(dest);

for (const f of files) {
  const from = path.join(root, f);
  if (!fs.existsSync(from)) throw new Error(`Missing required file: ${f}`);
  fs.copyFileSync(from, path.join(dest, f));
}
for (const d of dirs) {
  fs.cpSync(path.join(root, d), path.join(dest, d), {
    recursive: true,
    filter: (src) => !/[\\/](\.DS_Store|Thumbs\.db)$/.test(src),
  });
}

let count = 0;
let bytes = 0;
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else {
      count += 1;
      bytes += fs.statSync(p).size;
    }
  }
})(dest);

console.log(`Created ${path.relative(process.cwd(), dest) || dest}: ${count} files, ${(bytes / 1024 / 1024).toFixed(1)} MB`);
console.log("Drag this folder onto Netlify → your site → Deploys (\"Drag and drop your project folder here\").");
