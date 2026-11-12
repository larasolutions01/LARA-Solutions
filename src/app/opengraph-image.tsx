import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const alt = "LARA Solutions — Intelligence That Drives Growth";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const logo = await readFile(path.join(process.cwd(), "public/brand/lara-logo-color.png"));
  const src = `data:image/png;base64,${logo.toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(circle at 85% 10%, rgba(40,100,255,0.55), transparent 45%), radial-gradient(circle at 0% 100%, rgba(0,201,232,0.35), transparent 50%), #081427",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={230} height={182} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>Intelligence That Drives Growth.</div>
          <div style={{ fontSize: 30, color: "#C5D1E6", marginTop: 24 }}>AI solutions · Automation · Digital marketing · Supply chain · Analytics</div>
        </div>
      </div>
    ),
    size,
  );
}
