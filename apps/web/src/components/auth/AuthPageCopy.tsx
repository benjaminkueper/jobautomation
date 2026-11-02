"use client";

import Link from "next/link";
import { useTranslation } from "@/i18n/useTranslation";

export function LoginHeaderCopy() {
  const { t } = useTranslation();
  return <p className="text-sm text-[#475569]">{t("auth.signInToAccount")}</p>;
}

export function LoginFooterCopy() {
  const { t } = useTranslation();
  return (
    <p className="text-center text-xs text-[#475569]">
      {t("auth.noAccount")}{" "}
      <Link href="/register" className="font-semibold text-[#2563EB] hover:text-[#1D4ED8]">
        {t("auth.signUp")}
      </Link>
    </p>
  );
}

export function RegisterHeaderCopy() {
  const { t } = useTranslation();
  return <p className="text-sm text-[#475569]">{t("auth.createWorkspace")}</p>;
}

export function RegisterFooterCopy() {
  const { t } = useTranslation();
  return (
    <p className="text-center text-xs text-[#475569]">
      {t("auth.alreadyHaveAccount")}{" "}
      <Link href="/login" className="font-semibold text-[#2563EB] hover:text-[#1D4ED8]">
        {t("auth.signIn")}
      </Link>
    </p>
  );
}
