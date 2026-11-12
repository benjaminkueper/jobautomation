import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import type { Job } from "@/types/job";
import { JobStatusBadge } from "./JobStatusBadge";
import { JobPriorityBadge } from "./JobPriorityBadge";
import { useTranslation } from "@/i18n/I18nProvider";

interface JobDetailHeaderProps {
  job: Job;
  /** Optional custom action bar. When provided, replaces the default placeholder buttons. */
  renderActions?: ReactNode;
}

export function JobDetailHeader({ job, renderActions }: JobDetailHeaderProps) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-2)] p-4 sm:p-5">
      <div className="flex flex-col gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm text-[var(--text-3)]">{job.company}</p>
          <h1 className="break-words text-xl font-semibold leading-snug text-[var(--text-1)] sm:text-2xl">
            {job.position}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <JobStatusBadge status={job.status} />
            <JobPriorityBadge priority={job.priority} />
          </div>
        </div>

        <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {renderActions ?? (
            <>
              <Button variant="outline" className="w-full">
                {t("jobs.editJob")}
              </Button>
              <Button variant="secondary" className="w-full">
                {t("jobs.generateDraft")}
              </Button>
              <Button className="w-full">{t("jobs.markApplied")}</Button>
              <Button variant="outline" className="w-full">
                {t("jobs.archive")}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
