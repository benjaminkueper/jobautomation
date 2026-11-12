import { isSuperAdminEmail } from "@jobflow/shared/utils/super-admin";
import type { TenantRole } from "@jobflow/shared/types/user";
import { UserModel } from "@jobflow/database/models";

const SUPER_ADMIN_ROLE: TenantRole = "Owner";

/** Re-exported so existing API imports keep working. */
export { isSuperAdminEmail };

export function resolveSuperAdminRole(email: string | undefined | null, currentRole: string): TenantRole {
  return isSuperAdminEmail(email) ? SUPER_ADMIN_ROLE : (currentRole as TenantRole);
}

/** Persist Owner role for configured super-admin emails (idempotent). */
export async function ensureSuperAdminUser(
  userId: string,
  email: string,
  currentRole: string
): Promise<TenantRole> {
  if (!isSuperAdminEmail(email)) {
    return currentRole as TenantRole;
  }

  await UserModel.updateOne(
    { _id: userId },
    {
      $set: {
        role: SUPER_ADMIN_ROLE,
        status: "Active",
        "preferences.isSuperAdmin": true,
      },
    }
  );

  return SUPER_ADMIN_ROLE;
}
