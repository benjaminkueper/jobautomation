export type AdminUserRole = "Owner" | "Admin" | "Member" | "Viewer";
export type AdminUserStatus = "Active" | "Invited" | "Suspended" | "Removed";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  tenantId: string;
  workspaceName: string;
  workspaceSlug: string;
  workspacePlan: string;
  workspaceStatus: string;
  isSuperAdmin: boolean;
  isProtected: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface AdminTenant {
  id: string;
  name: string;
  slug: string;
  plan: string;
  status: string;
  usersCount: number;
  maxUsers: number | null;
}

export interface AdminUserStats {
  total: number;
  active: number;
  invited: number;
  suspended: number;
  removed: number;
  workspaces: number;
}

export interface AdminUserListResponse {
  users: AdminUser[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  stats: AdminUserStats;
  tenants: AdminTenant[];
}

export interface AdminUserCreateResult {
  user: AdminUser;
  temporaryPassword?: string;
}

export const ADMIN_USER_ROLES: AdminUserRole[] = ["Owner", "Admin", "Member", "Viewer"];
export const ADMIN_USER_STATUSES: AdminUserStatus[] = ["Active", "Invited", "Suspended", "Removed"];
