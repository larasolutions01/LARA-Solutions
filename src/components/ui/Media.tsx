import Image from "next/image";
import { photos, type Photo, type PhotoKey } from "@/content/media";
import { cn } from "@/lib/utils";

/**
 * Registry-driven responsive photo. Pass `photo` (a media key) or a resolved
 * `image`. Uses blur placeholders to avoid flashes and layout shift.
 */
export function Media({
  photo,
  image,
  alt,
  sizes = "100vw",
  priority,
  fill = true,
  className,
  imgClassName,
  quality = 72,
}: {
  photo?: PhotoKey;
  image?: Photo;
  alt?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  className?: string;
  imgClassName?: string;
  quality?: number;
}) {
  const p = image ?? (photo ? photos[photo] : undefined);
  if (!p) return null;
  const common = {
    src: p.src,
    alt: alt ?? p.alt,
    sizes,
    priority,
    quality,
    placeholder: p.blurDataURL ? ("blur" as const) : ("empty" as const),
    blurDataURL: p.blurDataURL,
  };
  if (fill) {
    return (
      <div className={cn("overflow-hidden", !/\babsolute\b/.test(className ?? "") && "relative", className)}>
        <Image {...common} fill className={cn("object-cover", imgClassName)} />
      </div>
    );
  }
  return <Image {...common} width={p.width} height={p.height} className={cn("h-auto w-full object-cover", className, imgClassName)} />;
}
