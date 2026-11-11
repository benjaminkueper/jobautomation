import type {
  AdminTenant,
  AdminUser,
  AdminUserCreateResult,
  AdminUserListResponse,
  AdminUserStats,
} from "@/types/admin-user";
import { apiFetch, withQuery } from "./client";

export function listAdminUsers(params?: Record<string, unknown>) {
  return apiFetch<AdminUserListResponse>(withQuery("/admin/users", params as never));
}

export function getAdminUserStats() {
  return apiFetch<AdminUserStats>("/admin/users/stats");
}

export function listAdminTenants() {
  return apiFetch<AdminTenant[]>("/admin/tenants");
}

export function createAdminUser(payload: Record<string, unknown>) {
  return apiFetch<AdminUserCreateResult>("/admin/users", { method: "POST", body: payload });
}

export function updateAdminUser(id: string, payload: Record<string, unknown>) {
  return apiFetch<AdminUser>(`/admin/users/${id}`, { method: "PATCH", body: payload });
}

export function removeAdminUser(id: string) {
  return apiFetch<AdminUser>(`/admin/users/${id}`, { method: "DELETE" });
}

export function resetAdminUserPassword(id: string) {
  return apiFetch<{ temporaryPassword: string }>(`/admin/users/${id}/reset-password`, {
    method: "POST",
    body: {},
  });
}
