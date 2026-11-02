"use client";

import Link from "next/link";
import type { SettingsSection } from "@/types/settings";
import { SETTINGS_SECTION_I18N_KEY } from "@/i18n/settings-sections";
import { useTranslation } from "@/i18n/useTranslation";
import { settingsSectionHref } from "@/lib/settings-routing";
import { cn } from "@/lib/utils";

interface SettingsMobileTabsProps {
  sections: SettingsSection[];
  activeSection: SettingsSection;
}

export function SettingsMobileTabs({ sections, activeSection }: SettingsMobileTabsProps) {
  const { t } = useTranslation();

  return (
    <div
      className="sticky top-[var(--mobile-chrome-top)] z-30 -mx-1 bg-[var(--bg-0)]/95 pb-2 pt-1 backdrop-blur-md md:static md:bg-transparent md:backdrop-blur-none"
      role="tablist"
      aria-label={t("settings.simpleTitle")}
    >
      <div className="flex flex-wrap gap-1.5 rounded-xl bg-[var(--surface-2)] p-1.5">
        {sections.map((section) => {
          const selected = activeSection === section;
          return (
            <Link
              key={section}
              href={settingsSectionHref(section)}
              scroll={false}
              replace
              role="tab"
              aria-selected={selected}
              className={cn(
                "flex min-h-[44px] min-w-0 grow basis-[calc(50%-3px)] items-center justify-center rounded-lg border px-2 py-2 text-center text-[12.5px] font-medium leading-tight transition-colors touch-manipulation sm:basis-[calc(25%-4.5px)] sm:px-2.5 sm:text-[13px]",
                selected
                  ? "border-[var(--accent-ring)] bg-[var(--surface-1)] text-[var(--accent-hi)] shadow-sm"
                  : "border-[var(--border-subtle)] bg-[var(--surface-1)] text-[var(--text-3)] active:bg-[var(--surface-3)]"
              )}
            >
              {t(SETTINGS_SECTION_I18N_KEY[section])}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
