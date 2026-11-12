import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Official LARA Solutions logo (extracted, unmodified, from the supplied
 * artwork). `variant` switches between the colour and white versions.
 */
export function Logo({
  variant = "color",
  className,
  priority,
  href = "/",
}: {
  variant?: "color" | "white";
  className?: string;
  priority?: boolean;
  href?: string | null;
}) {
  const img = (
    <Image
      src={variant === "color" ? "/brand/lara-logo-color.png" : "/brand/lara-logo-white.png"}
      alt="LARA Solutions"
      width={919}
      height={727}
      priority={priority}
      sizes="120px"
      className={cn("w-auto select-none", className ?? "h-14")}
    />
  );
  if (href === null) return img;
  return (
    <Link href={href} aria-label="LARA Solutions — home" className="inline-flex shrink-0 items-center rounded-md">
      {img}
    </Link>
  );
}
