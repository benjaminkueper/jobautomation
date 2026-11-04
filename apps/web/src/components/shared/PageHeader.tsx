import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "gradient-border flex flex-col gap-3 p-4 sm:gap-4 sm:p-5 md:p-6 lg:flex-row lg:items-start lg:justify-between",
        className
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="min-w-0 space-y-1.5">
          <h1 className="font-display text-[22px] font-bold tracking-[-0.02em] text-[var(--text-1)] sm:text-[26px] lg:text-[30px]">
            {title}
          </h1>
          {description ? (
            <p className="max-w-2xl text-[13px] leading-relaxed text-[var(--text-3)] lg:text-sm">{description}</p>
          ) : null}
        </div>
      </div>
      {actions ? (
        <div className="flex w-full shrink-0 flex-col gap-2 [&_button]:w-full sm:[&_button]:w-auto sm:w-auto sm:flex-row sm:items-center">{actions}</div>
      ) : null}
    </div>
  );
}
