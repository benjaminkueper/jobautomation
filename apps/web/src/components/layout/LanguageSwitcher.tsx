"use client";

import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/translations";
import { useTranslation } from "@/i18n/useTranslation";
import { CheckIcon, ChevronDownIcon } from "@/components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  useDropdownMenuContext,
} from "@/components/ui/dropdown-menu";

type Props = {
  /** Compact DE/EN pill for mobile topbar */
  compact?: boolean;
};

const OPTIONS: { code: Locale; name: string }[] = [
  { code: "de", name: "Deutsch" },
  { code: "en", name: "English" },
];

function FlagIcon({ code, className }: { code: Locale; className?: string }) {
  if (code === "de") {
    return (
      <svg viewBox="0 0 5 3" className={className} aria-hidden="true" focusable="false">
        <rect width="5" height="1" y="0" fill="#000000" />
        <rect width="5" height="1" y="1" fill="#DD0000" />
        <rect width="5" height="1" y="2" fill="#FFCE00" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 60 30" className={className} aria-hidden="true" focusable="false">
      <rect width="60" height="30" fill="#00247D" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#CF142B" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#FFFFFF" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#CF142B" strokeWidth="6" />
    </svg>
  );
}

function LocaleItem({ code, name, active }: { code: Locale; name: string; active: boolean }) {
  const { setLocale } = useTranslation();
  const dropdown = useDropdownMenuContext();

  return (
    <DropdownMenuItem
      aria-checked={active}
      className={cn(
        "flex items-center justify-between gap-3",
        active && "bg-[var(--surface-3)] font-semibold text-[var(--text-1)]"
      )}
      onClick={() => {
        setLocale(code);
        dropdown?.close();
      }}
    >
      <span className="flex min-w-0 items-center gap-2">
        <FlagIcon code={code} className="h-[14px] w-[21px] shrink-0 rounded-[2px] ring-1 ring-black/10" />
        <span className="truncate">{name}</span>
      </span>
      {active ? <CheckIcon size={14} className="shrink-0 text-[var(--accent)]" /> : null}
    </DropdownMenuItem>
  );
}

export function LanguageSwitcher({ compact }: Props) {
  const { locale, setLocale, t } = useTranslation();

  if (compact) {
    return (
      <div
        className="inline-flex shrink-0 items-center rounded-[var(--r-md)] border border-[var(--border-default)] bg-[var(--surface-2)] p-1"
        role="group"
        aria-label={t("language.label")}
      >
        {OPTIONS.map(({ code, name }) => {
          const active = locale === code;
          return (
            <button
              key={code}
              type="button"
              onClick={() => setLocale(code)}
              className={cn(
                "flex min-h-10 min-w-[44px] items-center justify-center gap-1 rounded-md px-2.5 text-[13px] font-semibold transition-colors",
                active
                  ? "bg-[var(--accent)] text-white shadow-sm"
                  : "text-[var(--text-2)] hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]"
              )}
              aria-pressed={active}
              aria-label={name}
            >
              <FlagIcon code={code} className="h-[19px] w-[28px] rounded-[3px] ring-1 ring-black/20" />
            </button>
          );
        })}
      </div>
    );
  }

  const current = OPTIONS.find((o) => o.code === locale) ?? OPTIONS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <button
          type="button"
          className="flex h-[34px] items-center gap-1.5 rounded-[var(--r-sm)] border border-[var(--border-default)] bg-[var(--surface-2)] pl-2 pr-1.5 text-[13px] font-semibold text-[var(--text-1)] transition-colors hover:bg-[var(--surface-3)]"
          aria-label={`${t("language.label")}: ${current.code.toUpperCase()}`}
        >
          <FlagIcon code={current.code} className="h-[14px] w-[21px] rounded-[2px] ring-1 ring-black/10" />
          <span>{current.code.toUpperCase()}</span>
          <ChevronDownIcon size={12} className="text-[var(--text-3)]" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent style={{ right: "auto" }}>
        {OPTIONS.map((option) => (
          <LocaleItem
            key={option.code}
            code={option.code}
            name={option.name}
            active={locale === option.code}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
