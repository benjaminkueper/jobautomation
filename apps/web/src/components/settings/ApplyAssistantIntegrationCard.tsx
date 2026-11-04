"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n/useTranslation";

/** Mobile-first apply: open job link, share Firebase-stored docs, mark Applied. */
export function ApplyAssistantIntegrationCard() {
  const { t } = useTranslation();

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="text-base">{t("integrations.applyAssistantCard.title")}</CardTitle>
        <CardDescription>{t("integrations.applyAssistantCard.description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 text-sm text-muted-foreground">
        <p>{t("integrations.applyAssistantCard.body")}</p>
        <Link
          href="/apply-assistant"
          className={cn(buttonVariants({ variant: "default" }), "mt-auto min-h-[44px] w-full sm:w-auto")}
        >
          {t("labels.openApplyAssistant")}
        </Link>
      </CardContent>
    </Card>
  );
}
