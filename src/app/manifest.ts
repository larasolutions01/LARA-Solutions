import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: "LARA",
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#081427",
    theme_color: "#081427",
    icons: [
      { src: "/brand/lara-icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/lara-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
