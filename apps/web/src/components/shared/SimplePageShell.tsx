import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Customer page shell.
 * Mobile: readable max width, centered in the main column (same centering
 * pattern as the landing sections, so content never hugs the left edge).
 * md+: fill the dashboard main column (no leftover phone strip on wide monitors).
 */
export function SimplePageShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full min-w-0 space-y-5 pb-4",
        "max-w-lg sm:max-w-xl md:mx-0 md:max-w-none",
        className
      )}
    >
      {children}
    </div>
  );
}
