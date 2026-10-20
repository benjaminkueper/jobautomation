import { ApiError } from "./errors";

/** Tenant scoping guard shared by API and worker-side services. */
export function assertTenantId(tenantId?: string): string {
  if (!tenantId) throw new ApiError("Tenant context is required", 400, "TENANT_REQUIRED");
  return tenantId;
}
