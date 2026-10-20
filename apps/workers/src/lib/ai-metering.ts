import { estimateAiUsage } from "@jobflow/integrations/ai/ai.service";
import { checkPlanLimit } from "@jobflow/database/services/plan-limits.service";
import { logAiUsage } from "@jobflow/database/services/ai-usage.service";
import type { AiProvider } from "@jobflow/shared/types/ai";
import { logger } from "../utils/logger";

/**
 * AI credit metering for worker-side Claude calls.
 *
 * apps/api meters its own AI paths (research, draft, CV tailoring, intake); workers previously spent
 * the platform Anthropic key with neither an allowance check nor an usage record. These helpers give
 * queued jobs the same two guarantees: refuse to spend past the tenant's plan allowance, and record
 * what was spent.
 */
export type AiMeteringContext = {
  tenantId: string;
  userId?: string;
  /** Matches apps/api runType labels so /ai/usage aggregates API and worker runs together. */
  runType: string;
  operationId?: string;
  relatedRecordType?: string;
  relatedRecordId?: string;
};

/**
 * Pre-flight plan allowance check (mirrors apps/api `assertCanUseAiCredits`).
 * Throws a plain Error — processors already mark the job Failed and rethrow; no HTTP status involved.
 */
export async function assertWorkerAiCredits(ctx: AiMeteringContext, textLength?: number): Promise<void> {
  const { estimatedCredits } = estimateAiUsage({ runType: ctx.runType, textLength });
  const result = await checkPlanLimit({
    tenantId: ctx.tenantId,
    limitName: "maxAiCredits",
    incrementBy: estimatedCredits,
  });
  if (result.allowed) return;
  throw new Error(
    `Plan limit reached for AI credits (used ${result.currentUsage}/${result.limit} on the ${result.planKey} plan, this run needs ~${estimatedCredits}). Upgrade the plan or add AI credits to continue.`,
  );
}

/**
 * Records an AI run. Never throws: a metering failure must not fail a job that already succeeded.
 * Mirrors apps/api `logAiUsage` (writes the usage log, then increments the tenant's monthly credits).
 */
export async function recordWorkerAiUsage(
  ctx: AiMeteringContext,
  input: {
    provider: AiProvider;
    model: string;
    inputText?: string;
    outputText?: string;
    usedStub: boolean;
  },
): Promise<void> {
  try {
    await logAiUsage({
      tenantId: ctx.tenantId,
      userId: ctx.userId,
      provider: input.provider,
      model: input.model,
      runType: ctx.runType,
      operationId: ctx.operationId,
      relatedRecordType: ctx.relatedRecordType,
      relatedRecordId: ctx.relatedRecordId,
      inputText: input.inputText,
      outputText: input.outputText,
      usedStub: input.usedStub,
    });
  } catch (err) {
    logger.error({ err, runType: ctx.runType, operationId: ctx.operationId }, "failed to record AI usage");
  }
}
