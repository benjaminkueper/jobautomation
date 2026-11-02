import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "yellow" | "green" | "outline" | "cream";

const styles: Record<Variant, string> = {
  // Both accent variants render the primary blue pill (#2563EB, white text).
  yellow: "bg-[var(--lp-brand)] text-white",
  green: "bg-[var(--lp-brand)] text-white",
  outline: "border-[2.5px] border-[var(--lp-heading)] bg-transparent text-[var(--lp-heading)]",
  cream: "border-[2.5px] border-white/80 bg-transparent text-white",
};

export function HighlightPill({
  children,
  variant = "yellow",
  className,
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-[0.5em] py-[0.06em] align-baseline font-bold leading-none",
        styles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
