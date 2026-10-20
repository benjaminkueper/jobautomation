import { TenantModel } from "../models";
import { PLAN_DEFINITIONS, displayPlanToPlanKey, normalizePlanKey } from "@jobflow/shared/constants/plans";
import type { PlanLimitCheckResult, PlanLimitName, PlanUsage, SubscriptionPlanKey } from "@jobflow/shared/types/billing";
import { assertTenantId } from "@jobflow/shared/utils/tenant-context";
import { ApiError } from "@jobflow/shared/utils/errors";

function isMongoObjectId(value: string): boolean {
  return /^[a-f\d]{24}$/i.test(value);
}

/** Avoid Mongo CastError when tenantId is a slug rather than ObjectId. */
export function safeTenantQuery(tenantId: string): Record<string, unknown> | null {
  const trimmed = tenantId.trim();
  if (!trimmed) return null;
  const clauses: Record<string, unknown>[] = [{ slug: trimmed }];
  if (isMongoObjectId(trimmed)) {
    clauses.unshift({ _id: trimmed });
  }
  return { $or: clauses };
}

export function tenantQuery(tenantId: string) {
  return safeTenantQuery(tenantId) ?? { slug: "__invalid__" };
}

export function resolvePlanKey(tenant: { plan?: string; billing?: { planKey?: string } }): SubscriptionPlanKey {
  const fromBilling = tenant.billing?.planKey;
  if (fromBilling) return normalizePlanKey(fromBilling);
  const display = tenant.plan;
  if (display && displayPlanToPlanKey[display]) return normalizePlanKey(displayPlanToPlanKey[display]);
  return "free";
}

function isUnlimitedLimit(value: unknown): boolean {
  return value === "unlimited" || value === "custom";
}

export function numericLimit(value: unknown): number | null {
  if (value === undefined || value === null) return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (isUnlimitedLimit(value)) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function usageForMetric(usage: Record<string, number | undefined>, limitName: PlanLimitName): number {
  const map: Record<PlanLimitName, keyof PlanUsage> = {
    maxJobs: "jobsCount",
    maxAutomationRuns: "automationRunsThisMonth",
    maxAiCredits: "aiCreditsUsedThisMonth",
    maxUsers: "usersCount",
    maxStorageMb: "storageUsedMb",
    maxIntegrations: "integrationsCount",
    maxReportsPerMonth: "reportsGeneratedThisMonth",
    maxCvVersions: "cvVersionsCount",
    maxDocuments: "documentsCount",
    maxQuickReviews: "quickReviewsThisMonth",
    maxResearchDocs: "researchDocsThisMonth",
    maxPdfExports: "pdfExportsThisMonth",
  };
  const key = map[limitName];
  return Number(usage[key] ?? 0);
}

/**
 * Plan allowance check — read-only, never increments. Shared by apps/api (which throws 402 on
 * `allowed: false`) and apps/workers (which skips the AI run).
 */
export async function checkPlanLimit(input: {
  tenantId: string;
  limitName: PlanLimitName;
  incrementBy?: number;
}): Promise<PlanLimitCheckResult> {
  const tenantId = assertTenantId(input.tenantId);
  const tenant = await TenantModel.findOne(tenantQuery(tenantId));
  if (!tenant) throw new ApiError("Tenant not found", 404, "TENANT_NOT_FOUND");

  const planKey = resolvePlanKey(tenant);
  const incrementBy = input.incrementBy ?? 0;

  const tenantLimits = tenant.limits as Record<string, unknown> | undefined;
  const limitRaw = tenantLimits?.[input.limitName] ?? PLAN_DEFINITIONS[planKey].limits[input.limitName];
  const limitCap = numericLimit(limitRaw);

  const currentUsage = usageForMetric((tenant.usage ?? {}) as Record<string, number | undefined>, input.limitName);

  if (limitCap === null) {
    return {
      allowed: true,
      limitName: input.limitName,
      currentUsage,
      limit: Number.POSITIVE_INFINITY,
      planKey,
    };
  }

  const allowed = currentUsage + incrementBy <= limitCap;
  return {
    allowed,
    reason: allowed ? undefined : "Plan limit reached. Upgrade your plan to continue.",
    limitName: input.limitName,
    currentUsage,
    limit: limitCap,
    planKey,
  };
}
