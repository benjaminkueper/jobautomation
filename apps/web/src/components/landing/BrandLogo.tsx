import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  /** Dark green surfaces need the light wordmark variant. */
  onDark?: boolean;
  className?: string;
  priority?: boolean;
};

/**
 * Plain <img> (not next/image) so PNG alpha is never flattened to a white box.
 */
export function BrandLogo({ onDark = false, className, priority }: Props) {
  const src = onDark ? "/logo-on-dark.png" : "/logo-transparent.png";

  return (
    <Link
      href="/"
      className={cn("inline-flex shrink-0 items-center bg-transparent", className)}
      aria-label="NewJob Guru home"
      style={{ background: "transparent" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="NewJob Guru"
        width={172}
        height={48}
        decoding="async"
        {...(priority ? { fetchPriority: "high" as const } : {})}
        className="h-9 w-auto bg-transparent object-contain object-left sm:h-10"
        style={{ background: "transparent", backgroundColor: "transparent" }}
      />
    </Link>
  );
}
