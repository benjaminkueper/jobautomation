import { isSuperAdminEmail } from "@jobflow/shared/utils/super-admin";
import { UserModel } from "../models";

/**
 * True when the workspace belongs to a platform super admin. Such workspaces are
 * not blocked by plan allowances (AI credits) so the operator can exercise every
 * feature the same way a paying client can.
 */
export async function isSuperAdminTenant(tenantId: string): Promise<boolean> {
  const trimmed = String(tenantId ?? "").trim();
  if (!trimmed) return false;

  const users = (await UserModel.find({ tenantId: trimmed })
    .select({ email: 1, preferences: 1 })
    .limit(50)
    .lean()) as Array<{ email?: string; preferences?: { isSuperAdmin?: boolean } }>;

  return users.some(
    (user) => user.preferences?.isSuperAdmin === true || isSuperAdminEmail(user.email)
  );
}
