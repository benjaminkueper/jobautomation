import { DocumentModel } from "@jobflow/database/models";
import type { Request, Response } from "express";
import { callAnthropicMessages, buildAnthropicModelCandidates, resolveAnthropicApiKey } from "@jobflow/integrations/ai/anthropic-messages";
import { estimateAiUsage } from "@jobflow/integrations/ai/ai.service";
import { asyncHandler } from "../utils/asyncHandler";
import { paginatedResponse, successResponse } from "../utils/apiResponse";
import { ApiError } from "../utils/errors";
import { logApiAction } from "../services/automation-log.service";
import { assertTenantId, buildTenantFilter, createTenantScopedRecord, findTenantScopedById, updateTenantScopedById } from "../services/baseTenant.service";
import { assertCanUseAiCredits } from "../services/plan-limit.service";
import { logAiUsage } from "../services/ai-usage.service";
import { getPagination } from "../utils/pagination";
import { routeCvToJobFolder } from "../services/cv-routing.service";
import { exportDocumentPdf } from "../services/pdf-export.service";
import { enqueueAutomationModule } from "../services/automation-queue.service";
import { sanitizeDocumentForApi } from "../utils/document-response";
import { processUploadedProfileDocument } from "@jobflow/workers/processors/document-upload";
import { syncDocumentToFirebase } from "../services/document-firebase-sync.service";
import { getFirebaseSignedUrl } from "../services/firebase-storage.service";
import { extractPdfTextFromBase64, isPdfUpload } from "../utils/pdf-text";

function profileTypeFromBody(body: Record<string, unknown>) {
  const explicit = String(body.profileDocumentType ?? "");
  if (explicit === "cv_resume" || explicit === "cover_letter_template" || explicit === "supporting_document") return explicit;
  if (body.type === "cv_resume" || body.type === "CV") return "cv_resume";
  if (body.type === "cover_letter_template" || body.type === "Cover Letter") return "cover_letter_template";
  if (body.type === "supporting_document" || body.type === "Portfolio") return "supporting_document";
  return undefined;
}

export const listDocuments = asyncHandler(async (req: Request, res) => {
  const tenantId = assertTenantId(req.tenantId);
  const { page, limit, skip } = getPagination(req.query);
  const search = typeof req.query.search === "string" ? req.query.search : undefined;
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const jobId = typeof req.query.jobId === "string" ? req.query.jobId : undefined;
  const workspaceProfile = typeof req.query.workspaceProfile === "string" && req.query.workspaceProfile === "true";
  const filter: Record<string, unknown> = buildTenantFilter(tenantId);
  if (status) filter.status = status;
  if (jobId) filter.jobId = jobId;

  const andClauses: Record<string, unknown>[] = [];
  if (workspaceProfile) {
    andClauses.push({ $or: [{ jobId: { $exists: false } }, { jobId: null }, { jobId: "" }] });
  }
  if (search) {
    andClauses.push({
      $or: [
        { fileName: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
        { storagePath: { $regex: search, $options: "i" } },
      ],
    });
  }
  if (andClauses.length > 0) {
    filter.$and = andClauses;
  }

  const [rows, total] = await Promise.all([
    DocumentModel.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
    DocumentModel.countDocuments(filter),
  ]);
  const sanitized = rows.map((r) => sanitizeDocumentForApi(r as Record<string, unknown>));
  return paginatedResponse(res, sanitized, { page, limit, total, totalPages: Math.ceil(total / limit) });
});
export const createDocument = asyncHandler(async (req: Request, res) => {
  const tenantId = assertTenantId(req.tenantId);
  const body = { ...req.body } as Record<string, unknown>;
  const profileDocumentType = profileTypeFromBody(body);
  const workspaceProfileUpload = profileDocumentType && !body.jobId;
  let contentText = typeof body.contentText === "string" ? body.contentText.trim() : "";
  const fileBase64 = typeof body.fileBase64 === "string" ? body.fileBase64 : undefined;
  const mimeType = typeof body.mimeType === "string" ? body.mimeType : undefined;
  delete body.fileBase64;
  delete body.mimeType;

  // Browser extraction can fail (blocked pdf.js worker, unusual encodings). Retry on the server
  // before rejecting a profile upload that arrived without text.
  let serverExtracted = false;
  if (!contentText && fileBase64 && isPdfUpload(mimeType, String(body.fileName ?? ""))) {
    const extracted = await extractPdfTextFromBase64(fileBase64);
    if (extracted) {
      contentText = extracted;
      // Persist into the row: the processor reads contentText back from the DB.
      body.contentText = extracted;
      serverExtracted = true;
    }
  }

  if (workspaceProfileUpload && profileDocumentType !== "supporting_document" && !contentText) {
    throw new ApiError(
      profileDocumentType === "cv_resume"
        ? "Master CV text is missing. Upload a CV with extractable text or paste the extracted CV text before saving."
        : "Cover letter template text is missing. Upload a template with extractable text or paste the extracted template text before saving.",
      422,
      "DOCUMENT_TEXT_REQUIRED"
    );
  }
  const notes = body.notes;
  if (typeof notes === "string" && notes.trim()) {
    const meta = typeof body.metadata === "object" && body.metadata !== null ? { ...(body.metadata as object) } : {};
    body.metadata = { ...meta, notes: notes.trim() };
  }
  delete body.notes;
  if (workspaceProfileUpload) {
    body.profileDocumentType = profileDocumentType;
    body.isActiveProfileDocument = false;
    body.sourceFileName = body.sourceFileName ?? body.fileName;
    body.extractionStatus = contentText ? "Provided" : "Not Required";
    body.metadata = {
      ...(typeof body.metadata === "object" && body.metadata !== null ? (body.metadata as Record<string, unknown>) : {}),
      workspaceLibrary: true,
      profileDocumentType,
      ...(serverExtracted ? { textExtractedOnServer: true } : {}),
    };
  }
  const row = await createTenantScopedRecord(DocumentModel, tenantId, req.user?.id ?? "system", body as never);
  const userId = req.user?.id ?? "system";
  const documentId = String(row._id);

  try {
    const firebaseResult = await syncDocumentToFirebase({
      tenantId,
      userId,
      documentId,
      fileName: String(body.fileName ?? "document"),
      contentText,
      fileBase64,
      mimeType,
      jobId: typeof body.jobId === "string" ? body.jobId : undefined,
    });
    if (firebaseResult.uploaded) {
      console.info("[firebase] document uploaded", { documentId, tenantId });
    } else {
      console.warn("[firebase] document not uploaded", {
        documentId,
        tenantId,
        reason: firebaseResult.reason ?? "unknown",
      });
    }
  } catch (error) {
    console.error("[firebase] document upload failed", {
      documentId,
      tenantId,
      message: error instanceof Error ? error.message : String(error),
    });
  }

  if (workspaceProfileUpload) {
    try {
      await processUploadedProfileDocument({
        tenantId,
        userId,
        documentId,
        profileDocumentType,
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Profile document post-processing failed";
      await DocumentModel.findByIdAndUpdate(row._id, {
        extractionStatus: contentText ? "Provided" : "Failed",
        extractionError: contentText ? msg : undefined,
        isActiveProfileDocument: Boolean(contentText) && profileDocumentType === "cv_resume",
        status: contentText ? "Ready" : "Draft",
        generationStatus: "Failed",
      });
    }
    const refreshed = await findTenantScopedById(DocumentModel, tenantId, documentId);
    const plain = refreshed && typeof refreshed.toObject === "function" ? refreshed.toObject() : refreshed ?? row;
    return successResponse(res, sanitizeDocumentForApi(plain as Record<string, unknown>), "Created", 201);
  }
  const refreshed = await findTenantScopedById(DocumentModel, tenantId, documentId);
  const plain = refreshed && typeof refreshed.toObject === "function" ? refreshed.toObject() : refreshed ?? row;
  return successResponse(res, sanitizeDocumentForApi(plain as Record<string, unknown>), "Created", 201);
});
export const getDocumentById = asyncHandler(async (req: Request, res) => {
  const tenantId = assertTenantId(req.tenantId);
  const row = await findTenantScopedById(DocumentModel, tenantId, req.params.id);
  if (!row) throw new ApiError("Not found", 404, "NOT_FOUND");
  const plain = typeof row.toObject === "function" ? row.toObject() : row;
  return successResponse(res, sanitizeDocumentForApi(plain));
});

export const getDocumentOpenUrl = asyncHandler(async (req: Request, res) => {
  const tenantId = assertTenantId(req.tenantId);
  const row = await findTenantScopedById(DocumentModel, tenantId, req.params.id);
  if (!row) throw new ApiError("Not found", 404, "NOT_FOUND");
  const plain = (typeof row.toObject === "function" ? row.toObject() : row) as Record<string, unknown>;
  const storageProvider = String(plain.storageProvider ?? "");
  const storagePath = String(plain.storagePath ?? "");
  if (storageProvider === "Firebase" && storagePath) {
    const url = await getFirebaseSignedUrl(storagePath, 7 * 24 * 60 * 60 * 1000);
    return successResponse(res, { url, fileName: plain.fileName });
  }
  const meta = plain.metadata && typeof plain.metadata === "object" ? (plain.metadata as Record<string, unknown>) : {};
  const text =
    typeof plain.contentText === "string" && plain.contentText.trim()
      ? plain.contentText
      : typeof meta.textExportContent === "string"
        ? meta.textExportContent
        : "";
  return successResponse(res, { contentText: text, fileName: plain.fileName });
});
export const updateDocument = asyncHandler(async (req: Request, res) => {
  const tenantId = assertTenantId(req.tenantId);
  const body = { ...req.body } as Record<string, unknown>;
  if (body.isActiveProfileDocument === true) {
    const existing = await findTenantScopedById(DocumentModel, tenantId, req.params.id);
    if (!existing) throw new ApiError("Not found", 404, "NOT_FOUND");
    const profileDocumentType =
      String((existing as Record<string, unknown>).profileDocumentType ?? "") ||
      profileTypeFromBody({ type: (existing as Record<string, unknown>).type });
    if (profileDocumentType) {
      await DocumentModel.updateMany(
        { tenantId, profileDocumentType, _id: { $ne: req.params.id } },
        { isActiveProfileDocument: false }
      );
      body.profileDocumentType = profileDocumentType;
    }
  }
  const row = await updateTenantScopedById(DocumentModel, tenantId, req.params.id, body);
  if (!row) throw new ApiError("Not found", 404, "NOT_FOUND");
  const plain = typeof row.toObject === "function" ? row.toObject() : row;
  return successResponse(res, sanitizeDocumentForApi(plain), "Updated");
});

/** Attachment fallback: plain text from `contentText` or metadata `textExportContent`. */
export const downloadDocumentText = asyncHandler(async (req: Request, res: Response) => {
  const tenantId = assertTenantId(req.tenantId);
  const row = await findTenantScopedById(DocumentModel, tenantId, req.params.id);
  if (!row) throw new ApiError("Not found", 404, "NOT_FOUND");
  const meta =
    row.metadata && typeof row.metadata === "object" ? (row.metadata as Record<string, unknown>) : {};
  const fromMeta = typeof meta.textExportContent === "string" ? meta.textExportContent : "";
  const body =
    typeof row.contentText === "string" && row.contentText.trim() ? row.contentText : fromMeta || "";
  const safeName = String(row.fileName ?? "document")
    .replace(/[^\w.\- ]+/g, "_")
    .slice(0, 120);
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${safeName}.txt"`);
  res.send(body);
});
export const routeCv = asyncHandler(async (req: Request, res) => { const tenantId=assertTenantId(req.tenantId); const documentId=req.params.id; const jobId=req.body.jobId as string; const userId=req.user?.id ?? "system"; const execute=req.query.execute==="true"; if(execute){ if(process.env.NODE_ENV==="production") throw new ApiError("Direct execute=true is disabled in production",403,"FORBIDDEN"); const result=await routeCvToJobFolder({ tenantId, documentId, jobId, userId }); return successResponse(res,result,'CV routed'); } const queued=await enqueueAutomationModule({ tenantId, userId, moduleKey:"cv-routing", payload:{ documentId, jobId }, source:"api" }); return successResponse(res,{operationId:queued.operationId,jobId:queued.jobId,moduleKey:"cv-routing",status:queued.status,message:queued.message},'CV routing queued'); });
export const exportPdf = asyncHandler(async (req: Request, res) => {
  const tenantId = assertTenantId(req.tenantId);
  const documentId = req.params.id;
  const userId = req.user?.id ?? "system";
  const execute = req.query.execute === "true";
  if (execute) {
    if (process.env.NODE_ENV === "production") {
      throw new ApiError("Direct execute=true is disabled in production", 403, "FORBIDDEN");
    }
    const result = await exportDocumentPdf({ tenantId, documentId, userId });
    const ok = Boolean(result.pdfUrl);
    await logApiAction({
      tenantId,
      moduleKey: "pdf-export",
      status: ok ? "Success" : "Warning",
      message: result.message,
      relatedRecordType: "Document",
      relatedRecordId: req.params.id,
      metadata: {
        operationId: result.operationId,
        exportStatus: result.status,
        pdfUrlValid: Boolean(result.pdfUrl),
        fallbackUsed: result.status === "completed-text",
      },
    });
    return successResponse(res, result, "PDF export completed");
  }
  const queued = await enqueueAutomationModule({
    tenantId,
    userId,
    moduleKey: "pdf-export",
    payload: { documentId },
    source: "api",
  });
  return successResponse(
    res,
    {
      operationId: queued.operationId,
      jobId: queued.jobId,
      moduleKey: "pdf-export",
      status: queued.status,
      message: queued.message,
    },
    "PDF export queued",
  );
});

const ATS_PROMPT_VERSION = "ats-base-score-v2";

/**
 * POST /documents/ats-score
 * Body: { cvText } | { contentText } | { content } | { documentId }
 * Contract matches the ATS Score panel in apps/web (categoryScores / strengths / criticalIssues).
 */
export const scoreAtsDocument = asyncHandler(async (req: Request, res) => {
  const tenantId = assertTenantId(req.tenantId);
  const userId = req.user?.id ?? "system";
  const body = req.body as Record<string, unknown>;

  const asText = (value: unknown): string => (typeof value === "string" ? value.trim() : "");
  let cvText = asText(body.cvText) || asText(body.contentText) || asText(body.content);
  const docId = asText(body.documentId);

  if (!cvText && docId) {
    const doc = await findTenantScopedById(DocumentModel, tenantId, docId);
    if (doc) {
      const row = doc as Record<string, unknown>;
      cvText = asText(row.contentText) || asText(row.content);
    }
  }

  if (!cvText) throw new ApiError("No CV content provided", 422, "VALIDATION_ERROR");

  const apiKey = resolveAnthropicApiKey();
  if (!apiKey) throw new ApiError("AI not configured", 503, "SERVICE_UNAVAILABLE");

  const prompt = `You are an expert ATS (Applicant Tracking System) analyst and career coach.
Analyse the CV below and return ONLY valid JSON — no markdown, no commentary.

Return a JSON object with exactly these keys:
  "overallScore": number 0-100 (ATS compatibility score)
  "categoryScores": {
    "formatting": number 0-100,
    "keywords": number 0-100,
    "structure": number 0-100,
    "readability": number 0-100,
    "impact": number 0-100
  }
  "strengths": string[] (3-5 things the CV does well for ATS)
  "criticalIssues": string[] (up to 5 issues that will cause ATS rejection)
  "improvements": string[] (5-8 specific, actionable improvements)
  "improvedHeadline": string (rewritten professional headline, max 12 words)
  "improvedSummary": string (rewritten 3-4 sentence ATS-optimised summary)

ATS scoring criteria:
- formatting: No tables, graphics, headers/footers; standard section names; consistent date formats
- keywords: Industry-standard job titles, skills vocabulary, action verbs
- structure: Clear sections (Experience, Education, Skills); reverse chronological order
- readability: Short bullets, quantified achievements, no jargon
- impact: Results-oriented language, metrics, scope of responsibility

CV to analyse:
${cvText.slice(0, 8000)}`;

  const estimated = estimateAiUsage({ runType: "ats-score", textLength: cvText.length });
  await assertCanUseAiCredits(tenantId, estimated.estimatedCredits);

  const result = await callAnthropicMessages({
    prompt,
    apiKey,
    modelCandidates: buildAnthropicModelCandidates(),
    maxTokens: 1200,
    temperature: 0.3,
  });
  if (!result.ok) throw new ApiError(result.message ?? "AI scoring failed", 503, "SERVICE_UNAVAILABLE");

  let parsed: Record<string, unknown> = {};
  try {
    const cleaned = result.text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    parsed = JSON.parse(match ? match[0] : cleaned) as Record<string, unknown>;
  } catch {
    throw new ApiError("Failed to parse AI response", 503, "SERVICE_UNAVAILABLE");
  }

  const categoryScores = (parsed.categoryScores ?? {}) as Record<string, unknown>;
  const strArray = (value: unknown): string[] =>
    Array.isArray(value) ? value.map((v) => String(v)).filter((v) => v.trim()) : [];
  const data = {
    overallScore: Number(parsed.overallScore ?? 0),
    categoryScores: {
      formatting: Number(categoryScores.formatting ?? 0),
      keywords: Number(categoryScores.keywords ?? 0),
      structure: Number(categoryScores.structure ?? 0),
      readability: Number(categoryScores.readability ?? 0),
      impact: Number(categoryScores.impact ?? 0),
    },
    strengths: strArray(parsed.strengths),
    criticalIssues: strArray(parsed.criticalIssues),
    improvements: strArray(parsed.improvements),
    improvedHeadline: String(parsed.improvedHeadline ?? ""),
    improvedSummary: String(parsed.improvedSummary ?? ""),
    promptVersion: ATS_PROMPT_VERSION,
  };

  await logAiUsage({
    tenantId,
    userId,
    provider: "Claude",
    model: result.model,
    runType: "ats-score",
    inputText: cvText,
    outputText: JSON.stringify(data),
    usedStub: false,
  });

  return successResponse(res, data);
});
