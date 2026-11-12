#!/usr/bin/env node
/**
 * Notify IndexNow-participating search engines (e.g. Bing) about new or
 * updated URLs. Run after a production deploy that changes content:
 *
 *   NEXT_PUBLIC_SITE_URL=https://larasolutions.co.in INDEXNOW_KEY=… npm run indexnow
 *   npm run indexnow -- /insights/new-article /solutions/ai-automation
 *
 * With no arguments, every URL in the live sitemap is submitted. The key must
 * also be configured on the deployed site so /indexnow-key.txt returns it.
 * IndexNow speeds up discovery; it does not guarantee crawling or indexing.
 */

const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://larasolutions.co.in").replace(/\/$/, "");
const key = (process.env.INDEXNOW_KEY || "").trim();

if (!/^https:\/\//.test(site)) fail("Set NEXT_PUBLIC_SITE_URL to the live https:// origin.");
if (!/^[a-zA-Z0-9-]{8,128}$/.test(key)) fail("Set INDEXNOW_KEY (8–128 letters, digits or dashes).");

const keyLocation = `${site}/indexnow-key.txt`;
const check = await fetch(keyLocation).catch(() => null);
if (!check?.ok || (await check.text()).trim() !== key) fail(`${keyLocation} does not return the key — deploy with INDEXNOW_KEY set first.`);

let urls = process.argv.slice(2).map((p) => (p.startsWith("http") ? p : `${site}${p.startsWith("/") ? p : `/${p}`}`));
if (urls.length === 0) {
  const xml = await (await fetch(`${site}/sitemap.xml`)).text();
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}
urls = urls.filter((u) => u.startsWith(site)).slice(0, 10000);
if (urls.length === 0) fail("No URLs to submit.");

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(site).host, key, keyLocation, urlList: urls }),
});
console.log(`IndexNow: submitted ${urls.length} URL(s) — HTTP ${res.status} ${res.statusText}`);
if (res.status >= 400) process.exit(1);

function fail(msg) {
  console.error(`IndexNow: ${msg}`);
  process.exit(1);
}
