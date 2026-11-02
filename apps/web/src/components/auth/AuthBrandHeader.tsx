"use client";

import { BrandLogo } from "@/components/landing/BrandLogo";
import { useTranslation } from "@/i18n/useTranslation";

/**
 * Landing-style auth header: the latest wordmark + a translated page heading
 * in the brand text color (#0F172A).
 */
export function AuthBrandHeader({ headingKey }: { headingKey: string }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <BrandLogo priority />
      <h1 className="text-[1.55rem] font-extrabold leading-tight tracking-tight text-[#0F172A] sm:text-[1.75rem]">
        {t(headingKey)}
      </h1>
    </div>
  );
}
