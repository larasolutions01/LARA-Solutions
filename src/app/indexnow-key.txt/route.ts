/**
 * IndexNow key file (https://www.indexnow.org). Serves the value of
 * INDEXNOW_KEY so participating search engines (e.g. Bing, Yandex) can verify
 * submissions made by `npm run indexnow`. Returns 404 when no key is set.
 */
export const dynamic = "force-dynamic";

export function GET() {
  const key = process.env.INDEXNOW_KEY?.trim();
  if (!key || !/^[a-zA-Z0-9-]{8,128}$/.test(key)) return new Response("Not found", { status: 404 });
  return new Response(key, { headers: { "Content-Type": "text/plain; charset=utf-8", "X-Robots-Tag": "noindex" } });
}
