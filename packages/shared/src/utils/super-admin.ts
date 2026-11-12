import { isPlatformOwnerEmail } from "../constants/product-roles";

/**
 * True when the email belongs to a platform super admin.
 * Used by API auth/middleware and by plan-limit checks.
 */
export function isSuperAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  if (isPlatformOwnerEmail(email)) return true;
  const raw = process.env.SUPER_ADMIN_EMAILS?.trim();
  if (!raw) return false;
  const normalized = email.trim().toLowerCase();
  return raw
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .some((entry) => entry.length > 0 && entry === normalized);
}
