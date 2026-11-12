/**
 * Media registry — every photo and video used on the site, with alt text,
 * licence and source. All stock media is ILLUSTRATIVE: it depicts real-world
 * business activity, not LARA Solutions staff, offices or clients.
 *
 * Replace any entry with your own brand photography by dropping a file in
 * /public/media and updating `src` (keep the key so components keep working).
 */
import meta from "./generated/media-meta.json";

type Meta = { w: number; h: number; blur: string };
const metaMap = meta as Record<string, Meta>;

export interface Photo {
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
  credit: { source: "Unsplash" | "Pexels" | "LARA Solutions"; url: string; licence: string };
}

const UNSPLASH = "Unsplash License (free commercial use, no attribution required)";
const PEXELS = "Pexels License (free commercial use, no attribution required)";

function photo(key: string, alt: string, unsplashId: string): Photo {
  const m = metaMap[key];
  return {
    src: `/media/photos/${key}.webp`,
    alt,
    width: m?.w ?? 1920,
    height: m?.h ?? 1280,
    blurDataURL: m?.blur,
    credit: { source: "Unsplash", url: `https://unsplash.com/photos/${unsplashId}`, licence: UNSPLASH },
  };
}

export const photos = {
  // Services
  "svc-ai": photo("svc-ai", "Professional working on a laptop at a bright, minimal desk", "9yCYGgPe5Kg"),
  "svc-marketing": photo("svc-marketing", "Team arranging colourful sticky notes on a glass wall during a planning session", "Imk2h0pyOvo"),
  "svc-supply": photo("svc-supply", "Two warehouse colleagues reviewing work while walking along a racked aisle", "ZlOlRnWk8zU"),
  "svc-analytics": photo("svc-analytics", "Woman reviewing charts and graphs on a laptop", "KNQUEQwTCY4"),
  "svc-process": photo("svc-process", "Technician assembling equipment on a bright production line", "zekShM5_K64"),
  "svc-transformation": photo("svc-transformation", "Developer working across multiple monitors", "udRj4qXyAPs"),
  // People
  "people-entrepreneur": photo("people-entrepreneur", "Smiling founder standing in front of a chalkboard mind map", "E4jeiHp2QHo"),
  "people-team": photo("people-team", "Diverse team gathered around a laptop solving a problem together", "yd_RKGH_RH4"),
  "people-creative": photo("people-creative", "Creative team collaborating around a whiteboard in a loft office", "wD1LRb9OeEo"),
  "people-planning": photo("people-planning", "Two colleagues planning ideas at a whiteboard", "uOhBxB23Wao"),
  "people-warehouse": photo("people-warehouse", "Warehouse team coordinating work along a bright logistics aisle", "c_4eaGRDSVU"),
  "people-tech": photo("people-tech", "Two people reviewing information on a tablet in a store", "r--jcbaXgek"),
  "people-celebrate": photo("people-celebrate", "Colleagues celebrating a milestone with high fives", "ljG-4b5OXIM"),
  // Industries
  "ind-retail": photo("ind-retail", "Online seller checking an order on her phone beside packed parcels", "k63Or81F8-M"),
  "ind-logistics": photo("ind-logistics", "Container ship and cranes at a busy shipping port", "oL3wEM0JEwQ"),
  "ind-manufacturing": photo("ind-manufacturing", "Workers on a modern factory production line", "oLS6IxceVNs"),
  "ind-healthcare": photo("ind-healthcare", "Two clinicians reviewing information on a tablet", "2kopEHjST-g"),
  "ind-finance": photo("ind-finance", "Advisor meeting with a client at a table with a laptop", "M5k978V3qBc"),
  "ind-realestate": photo("ind-realestate", "Modern apartment building with glass balconies", "4453DIQWtsQ"),
  "ind-saas": photo("ind-saas", "Open-plan technology office with people working at screens", "YI_9SivVt_s"),
  "ind-smb": photo("ind-smb", "Small business owners holding a ‘we’re open’ sign", "Dc5ZIiODzJo"),
  // Case studies
  "case-support": photo("case-support", "Customer support specialist wearing a headset at a computer", "wnpf3Q5pkXA"),
  "case-marketing": photo("case-marketing", "Laptop showing analytics on a glass table", "hpjSkU2UYSU"),
  "case-forecasting": photo("case-forecasting", "Cardboard boxes stored on warehouse racking", "BNBA1h-NgdY"),
  "case-reporting": photo("case-reporting", "Monitoring screen displaying performance charts", "qwtCeJ5cLYs"),
  "case-leads": photo("case-leads", "Modern home with a pool at dusk", "z6UAWpQAhXs"),
  // Insights
  "ins-ai-start": photo("ins-ai-start", "Business owner working at a laptop in a bright studio", "TLiWhlDEJwA"),
  "ins-process": photo("ins-process", "Hands mapping a customer journey with sticky notes", "w00FkE6e8zE"),
  "ins-marketing": photo("ins-marketing", "Analytics dashboard with performance graphs", "JKUTrJ4vK00"),
  "ins-supply": photo("ins-supply", "Stacked shipping containers under a blue sky", "bukjsECgmeU"),
  "ins-kpi": photo("ins-kpi", "Business team discussing results in a modern office", "_4tpElFQemQ"),
  "ins-foundation": photo("ins-foundation", "Laptop showing code on a busy desk", "m_HRfLhgABo"),
  // Atmosphere
  "city-dusk": photo("city-dusk", "City skyline at dusk", "Vq1lxH5TeQ0"),
  "city-towers": photo("city-towers", "Looking up at glass office towers", "PhYq704ffdA"),
  "port-night": photo("port-night", "Container ship being loaded at an illuminated port at night", "yx20mpDyr2I"),
  "process-chalkboard": photo("process-chalkboard", "Two people discussing a diagram on a chalkboard wall", "1tWSpIVPi78"),
  "team-review": photo("team-review", "Team collaborating around a computer screen", "Y32qbykD69g"),
  "team-present": photo("team-present", "Colleague presenting ideas on a whiteboard", "QiUWAuFleVg"),
  "team-laptop": photo("team-laptop", "Group of people working together on laptops", "QckxruozjRg"),
  "code-neon": photo("code-neon", "Computer screens displaying code in neon light", "WD7S-Lz12Es"),
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;

export interface VideoClip {
  key: string;
  src: string;
  poster: string;
  label: string;
  credit: { source: "Pexels"; url: string; licence: string };
}

function clip(key: string, label: string, pexelsId: string): VideoClip {
  return {
    key,
    src: `/media/videos/${key}.mp4`,
    poster: `/media/videos/${key}.webp`,
    label,
    credit: { source: "Pexels", url: `https://www.pexels.com/video/${pexelsId}/`, licence: PEXELS },
  };
}

/** Hero montage order — tells a story from idea to impact. */
export const heroClips: VideoClip[] = [
  clip("hero-team", "A team collaborating in a modern workspace", "7507758"),
  clip("hero-code", "An engineer building digital systems", "2516160"),
  clip("hero-marketing", "Marketers shaping a creative campaign", "3252013"),
  clip("hero-warehouse", "Parcels moving through a modern logistics centre", "10472376"),
  clip("hero-port", "Global trade flowing through a container port", "10391543"),
  clip("hero-analytics", "A leader reviewing live analytics dashboards", "8348319"),
  clip("hero-celebrate", "A team celebrating a successful outcome", "9034878"),
  clip("hero-city", "A bright, modern commercial city", "12685044"),
];

export function getClip(key: string) {
  return heroClips.find((c) => c.key === key)!;
}

/** Resolve a CMS image value: a registry key ("svc-ai") or a public path ("/uploads/x.jpg"). */
export function resolvePhoto(value: string | undefined, fallback: PhotoKey = "team-laptop"): Photo {
  if (value && value in photos) return photos[value as PhotoKey];
  if (value && value.startsWith("/")) {
    return { src: value, alt: "", width: 1600, height: 1000, credit: { source: "LARA Solutions", url: "", licence: "Own media" } };
  }
  return photos[fallback];
}
