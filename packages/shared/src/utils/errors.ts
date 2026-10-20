/**
 * Application error carrying HTTP semantics.
 *
 * Lives in @jobflow/shared so packages below apps/api (database, integrations, workers) can throw the
 * *same* class. apps/api re-exports it, keeping a single class identity so `err instanceof ApiError`
 * in the API error middleware keeps matching.
 */
export class ApiError extends Error {
  statusCode: number;
  code: string;
  details?: unknown;
  constructor(message: string, statusCode = 500, code = "INTERNAL_ERROR", details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}
