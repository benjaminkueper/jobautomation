import type { NextFunction, Request, Response } from "express";
import { UserModel } from "@jobflow/database/models";
import { errorResponse } from "../utils/apiResponse";
import { isSuperAdminEmail } from "../services/super-admin.service";

/**
 * Allows platform super admins only.
 *
 * A super admin is either:
 *  - an email on the server allowlist (SUPER_ADMIN_EMAILS / platform owner), or
 *  - a user whose `preferences.isSuperAdmin` flag is true (same signal the
 *    web app uses to render the Super Admin console).
 */
export async function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user?.id) {
    return errorResponse(res, "Authentication required", "UNAUTHORIZED", 401);
  }

  if (isSuperAdminEmail(req.user.email)) {
    return next();
  }

  try {
    const user = await UserModel.findById(req.user.id).select("preferences").lean();
    const preferences = (user as { preferences?: Record<string, unknown> } | null)?.preferences;
    if (preferences?.isSuperAdmin === true) {
      return next();
    }
  } catch {
    // Fall through to the generic forbidden response.
  }

  return errorResponse(res, "Super admin access required", "FORBIDDEN", 403);
}
