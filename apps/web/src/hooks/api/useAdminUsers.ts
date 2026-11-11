"use client";

import * as api from "@/lib/api/admin-users.api";
import type { AdminUserListResponse } from "@/types/admin-user";
import { useApiQuery } from "./useApiQuery";

export type AdminUsersParams = {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
};

export function useAdminUsers(params: AdminUsersParams) {
  const refreshKey = JSON.stringify(params);
  return useApiQuery<AdminUserListResponse>(() => api.listAdminUsers(params as Record<string, unknown>), {
    enabled: true,
    refreshKey,
  });
}
