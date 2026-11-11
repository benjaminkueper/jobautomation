import crypto from "node:crypto";
import mongoose from "mongoose";
import { TenantModel, UserModel } from "@jobflow/database/models";
import { isPlatformOwnerEmail } from "@jobflow/shared/constants/product-roles";
import { hashPassword } from "../utils/password";
import { ApiError } from "../utils/errors";
import { getPagination } from "../utils/pagination";
import { createAuditLog } from "./audit-log.service";
import { isSuperAdminEmail } from "./super-admin.service";

export const ADMIN_USER_ROLES = ["Owner", "Admin", "Member", "Viewer"] as const;
export const ADMIN_USER_STATUSES = ["Active", "Invited", "Suspended", "Removed"] as const;

export type AdminUserRole = (typeof ADMIN_USER_ROLES)[number];
export type AdminUserStatus = (typeof ADMIN_USER_STATUSES)[number];

export interface AdminUserDto {
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

export interface AdminTenantDto {
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

type RawUser = Record<string, unknown>;
type RawTenant = Record<string, unknown>;

function isRole(value: unknown): value is AdminUserRole {
  return typeof value === "string" && (ADMIN_USER_ROLES as readonly string[]).includes(value);
}

function isStatus(value: unknown): value is AdminUserStatus {
  return typeof value === "string" && (ADMIN_USER_STATUSES as readonly string[]).includes(value);
}

function normaliseEmail(value: unknown): string {
  const email = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApiError("A valid email is required", 422, "VALIDATION_ERROR");
  }
  return email;
}

function generateTempPassword(length = 14): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bytes = crypto.randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i += 1) out += alphabet[bytes[i] % alphabet.length];
  return `${out}!7`;
}

function userIsSuperAdmin(user: RawUser): boolean {
  const preferences = (user.preferences as Record<string, unknown> | undefined) ?? {};
  return isSuperAdminEmail(String(user.email ?? "")) || preferences.isSuperAdmin === true;
}

function userIsProtected(user: RawUser): boolean {
  return isPlatformOwnerEmail(String(user.email ?? "")) || userIsSuperAdmin(user);
}

function tenantMap(tenants: RawTenant[]): Map<string, RawTenant> {
  return new Map(tenants.map((t) => [String(t._id ?? t.id), t]));
}

function toAdminUser(user: RawUser, tenants: Map<string, RawTenant>): AdminUserDto {
  const tenantId = String(user.tenantId ?? "");
  const tenant = tenants.get(tenantId);
  return {
    id: String(user._id ?? user.id),
    name: String(user.name ?? ""),
    email: String(user.email ?? ""),
    role: (isRole(user.role) ? user.role : "Member") as AdminUserRole,
    status: (isStatus(user.status) ? user.status : "Invited") as AdminUserStatus,
    tenantId,
    workspaceName: tenant ? String(tenant.name ?? "") : "—",
    workspaceSlug: tenant ? String(tenant.slug ?? "") : "",
    workspacePlan: tenant ? String(tenant.plan ?? "") : "",
    workspaceStatus: tenant ? String(tenant.status ?? "") : "",
    isSuperAdmin: userIsSuperAdmin(user),
    isProtected: userIsProtected(user),
    lastLoginAt: user.lastLoginAt ? new Date(user.lastLoginAt as string | Date).toISOString() : undefined,
    createdAt: user.createdAt ? new Date(user.createdAt as string | Date).toISOString() : new Date().toISOString(),
  };
}

async function tenantsForUsers(users: RawUser[]): Promise<Map<string, RawTenant>> {
  const ids = [...new Set(users.map((u) => String(u.tenantId ?? "")).filter(Boolean))];
  if (!ids.length) return new Map();
  const tenants = (await TenantModel.find({ _id: { $in: ids } }).lean()) as RawTenant[];
  return tenantMap(tenants);
}

export async function listAdminUsers(input: {
  search?: string;
  status?: string;
  role?: string;
  page?: unknown;
  limit?: unknown;
}): Promise<{
  users: AdminUserDto[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  stats: AdminUserStats;
  tenants: AdminTenantDto[];
}> {
  const { page, limit, skip } = getPagination({ page: input.page, limit: input.limit });
  const filter: Record<string, unknown> = {};

  if (input.status && input.status !== "all") {
    if (!isStatus(input.status)) throw new ApiError("Invalid status filter", 422, "VALIDATION_ERROR");
    filter.status = input.status;
  }
  if (input.role && input.role !== "all") {
    if (!isRole(input.role)) throw new ApiError("Invalid role filter", 422, "VALIDATION_ERROR");
    filter.role = input.role;
  }

  const search = input.search?.trim();
  if (search) {
    const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const matchingTenants = (await TenantModel.find({ name: regex }).select("_id").limit(500).lean()) as RawTenant[];
    filter.$or = [
      { name: regex },
      { email: regex },
      ...(matchingTenants.length ? [{ tenantId: { $in: matchingTenants.map((t) => String(t._id)) } }] : []),
    ];
  }

  const [rows, total, statusCounts, workspaces, allTenants] = await Promise.all([
    UserModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    UserModel.countDocuments(filter),
    UserModel.aggregate<{ _id: string; count: number }>([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    TenantModel.countDocuments({}),
    TenantModel.find({}).sort({ name: 1 }).limit(500).lean(),
  ]);

  const typedRows = rows as RawUser[];
  const tenants = await tenantsForUsers(typedRows);
  const countByStatus = new Map(statusCounts.map((s) => [s._id, s.count]));
  const stats: AdminUserStats = {
    total: statusCounts.reduce((sum, s) => sum + s.count, 0),
    active: countByStatus.get("Active") ?? 0,
    invited: countByStatus.get("Invited") ?? 0,
    suspended: countByStatus.get("Suspended") ?? 0,
    removed: countByStatus.get("Removed") ?? 0,
    workspaces,
  };

  return {
    users: typedRows.map((u) => toAdminUser(u, tenants)),
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
    stats,
    tenants: (allTenants as RawTenant[]).map((t) => {
      const usage = (t.usage as Record<string, unknown> | undefined) ?? {};
      const limits = (t.limits as Record<string, unknown> | undefined) ?? {};
      const maxUsers = typeof limits.maxUsers === "number" ? limits.maxUsers : null;
      return {
        id: String(t._id ?? t.id),
        name: String(t.name ?? ""),
        slug: String(t.slug ?? ""),
        plan: String(t.plan ?? ""),
        status: String(t.status ?? ""),
        usersCount: typeof usage.usersCount === "number" ? usage.usersCount : 0,
        maxUsers,
      };
    }),
  };
}

export async function getAdminUserStats(): Promise<AdminUserStats> {
  const [statusCounts, workspaces] = await Promise.all([
    UserModel.aggregate<{ _id: string; count: number }>([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    TenantModel.countDocuments({}),
  ]);
  const byStatus = new Map(statusCounts.map((s) => [s._id, s.count]));
  return {
    total: statusCounts.reduce((sum, s) => sum + s.count, 0),
    active: byStatus.get("Active") ?? 0,
    invited: byStatus.get("Invited") ?? 0,
    suspended: byStatus.get("Suspended") ?? 0,
    removed: byStatus.get("Removed") ?? 0,
    workspaces,
  };
}

export async function listAdminTenants(): Promise<AdminTenantDto[]> {
  const tenants = (await TenantModel.find({}).sort({ name: 1 }).limit(500).lean()) as RawTenant[];
  return tenants.map((t) => {
    const usage = (t.usage as Record<string, unknown> | undefined) ?? {};
    const limits = (t.limits as Record<string, unknown> | undefined) ?? {};
    return {
      id: String(t._id ?? t.id),
      name: String(t.name ?? ""),
      slug: String(t.slug ?? ""),
      plan: String(t.plan ?? ""),
      status: String(t.status ?? ""),
      usersCount: typeof usage.usersCount === "number" ? usage.usersCount : 0,
      maxUsers: typeof limits.maxUsers === "number" ? limits.maxUsers : null,
    };
  });
}

export async function createAdminUser(input: {
  name?: unknown;
  email?: unknown;
  password?: unknown;
  role?: unknown;
  tenantId?: unknown;
  actorId: string;
  req?: import("express").Request;
}): Promise<{ user: AdminUserDto; temporaryPassword?: string }> {
  const name = typeof input.name === "string" ? input.name.trim() : "";
  if (!name) throw new ApiError("Name is required", 422, "VALIDATION_ERROR");
  const email = normaliseEmail(input.email);

  const role: AdminUserRole = isRole(input.role) ? input.role : "Member";
  const tenantId = typeof input.tenantId === "string" ? input.tenantId.trim() : "";
  if (!tenantId || !mongoose.isValidObjectId(tenantId)) {
    throw new ApiError("A workspace is required", 422, "VALIDATION_ERROR");
  }

  const tenant = (await TenantModel.findById(tenantId).lean()) as RawTenant | null;
  if (!tenant) throw new ApiError("Workspace not found", 404, "TENANT_NOT_FOUND");

  const existing = await UserModel.exists({ email });
  if (existing) throw new ApiError("An account with this email already exists", 409, "EMAIL_IN_USE");

  const limits = (tenant.limits as Record<string, unknown> | undefined) ?? {};
  const usage = (tenant.usage as Record<string, unknown> | undefined) ?? {};
  const maxUsers = typeof limits.maxUsers === "number" ? limits.maxUsers : null;
  const usersCount = typeof usage.usersCount === "number" ? usage.usersCount : 0;
  if (maxUsers !== null && maxUsers > 0 && usersCount >= maxUsers) {
    throw new ApiError(
      `This workspace has reached its user limit (${maxUsers}).`,
      409,
      "PLAN_LIMIT_REACHED"
    );
  }

  const providedPassword = typeof input.password === "string" ? input.password : "";
  if (providedPassword && providedPassword.length < 8) {
    throw new ApiError("Password must be at least 8 characters", 422, "VALIDATION_ERROR");
  }
  const temporaryPassword = providedPassword || generateTempPassword();
  const passwordHash = await hashPassword(temporaryPassword);

  const userId = new mongoose.Types.ObjectId();
  const created = await UserModel.create({
    _id: userId,
    tenantId,
    createdBy: input.actorId,
    name,
    email,
    passwordHash,
    role,
    status: "Active",
  });

  await TenantModel.updateOne(
    { _id: tenantId },
    { $inc: { "usage.usersCount": 1 }, $set: { updatedBy: input.actorId } }
  );

  await createAuditLog({
    tenantId,
    userId: input.actorId,
    action: "user.created",
    entityType: "User",
    entityId: userId.toString(),
    message: `User ${email} created by super admin`,
    metadata: { email, role },
    req: input.req,
  });

  const tenants = await tenantsForUsers([created.toObject() as RawUser]);
  return {
    user: toAdminUser(created.toObject() as RawUser, tenants),
    temporaryPassword: providedPassword ? undefined : temporaryPassword,
  };
}

export async function updateAdminUser(input: {
  id: string;
  name?: unknown;
  role?: unknown;
  status?: unknown;
  actorId: string;
  req?: import("express").Request;
}): Promise<AdminUserDto> {
  if (!mongoose.isValidObjectId(input.id)) throw new ApiError("User not found", 404, "NOT_FOUND");
  const user = (await UserModel.findById(input.id).lean()) as RawUser | null;
  if (!user) throw new ApiError("User not found", 404, "NOT_FOUND");

  const targetId = String(user._id);
  const isSelf = targetId === input.actorId;
  const protectedUser = userIsProtected(user);

  const updates: Record<string, unknown> = {};

  if (input.name !== undefined) {
    const name = typeof input.name === "string" ? input.name.trim() : "";
    if (!name) throw new ApiError("Name is required", 422, "VALIDATION_ERROR");
    updates.name = name;
  }
  if (input.role !== undefined) {
    if (!isRole(input.role)) throw new ApiError("Invalid role", 422, "VALIDATION_ERROR");
    updates.role = input.role;
  }
  if (input.status !== undefined) {
    if (!isStatus(input.status)) throw new ApiError("Invalid status", 422, "VALIDATION_ERROR");
    updates.status = input.status;
  }

  if (protectedUser) {
    if (!isSelf) {
      throw new ApiError("This protected account cannot be modified.", 403, "PROTECTED_USER");
    }
    if (updates.role !== undefined || updates.status !== undefined) {
      throw new ApiError(
        "Your own role and status cannot be changed from user management.",
        403,
        "PROTECTED_USER"
      );
    }
  }

  if (isSelf) {
    if (updates.status !== undefined && updates.status !== "Active") {
      throw new ApiError("You cannot deactivate your own account.", 403, "SELF_LOCKOUT");
    }
    if (updates.role !== undefined && user.role === "Owner" && updates.role !== "Owner") {
      throw new ApiError("You cannot remove your own owner role.", 403, "SELF_LOCKOUT");
    }
  }

  if (!Object.keys(updates).length) {
    const tenants = await tenantsForUsers([user]);
    return toAdminUser(user, tenants);
  }

  const wasRemoved = user.status === "Removed";
  const willBeRemoved = updates.status === "Removed";
  const removing = !wasRemoved && willBeRemoved;
  const reactivating = wasRemoved && typeof updates.status === "string" && updates.status !== "Removed";

  const setPayload: Record<string, unknown> = { ...updates, updatedBy: input.actorId };
  if (removing) setPayload.deletedAt = new Date();
  const updateOperation: Record<string, unknown> = { $set: setPayload };
  if (reactivating) updateOperation.$unset = { deletedAt: 1 };

  const updated = (await UserModel.findByIdAndUpdate(
    input.id,
    updateOperation,
    { new: true }
  ).lean()) as RawUser | null;
  if (!updated) throw new ApiError("User not found", 404, "NOT_FOUND");

  if (removing) {
    await TenantModel.updateOne(
      { _id: String(updated.tenantId ?? ""), "usage.usersCount": { $gt: 0 } },
      { $inc: { "usage.usersCount": -1 } }
    );
  } else if (reactivating) {
    await TenantModel.updateOne(
      { _id: String(updated.tenantId ?? "") },
      { $inc: { "usage.usersCount": 1 } }
    );
  }

  await createAuditLog({
    tenantId: String(updated.tenantId ?? ""),
    userId: input.actorId,
    action: "user.updated",
    entityType: "User",
    entityId: targetId,
    message: `User ${String(updated.email ?? "")} updated by super admin`,
    metadata: updates,
    req: input.req,
  });

  const tenants = await tenantsForUsers([updated]);
  return toAdminUser(updated, tenants);
}

export async function removeAdminUser(input: {
  id: string;
  actorId: string;
  req?: import("express").Request;
}): Promise<AdminUserDto> {
  if (!mongoose.isValidObjectId(input.id)) throw new ApiError("User not found", 404, "NOT_FOUND");
  const user = (await UserModel.findById(input.id).lean()) as RawUser | null;
  if (!user) throw new ApiError("User not found", 404, "NOT_FOUND");

  const targetId = String(user._id);
  if (targetId === input.actorId) {
    throw new ApiError("You cannot remove your own account.", 403, "SELF_LOCKOUT");
  }
  if (userIsProtected(user)) {
    throw new ApiError("This protected account cannot be removed.", 403, "PROTECTED_USER");
  }

  if (user.status === "Removed") {
    const tenants = await tenantsForUsers([user]);
    return toAdminUser(user, tenants);
  }

  const updated = (await UserModel.findByIdAndUpdate(
    input.id,
    { $set: { status: "Removed", updatedBy: input.actorId, deletedAt: new Date() } },
    { new: true }
  ).lean()) as RawUser | null;
  if (!updated) throw new ApiError("User not found", 404, "NOT_FOUND");

  await TenantModel.updateOne(
    { _id: String(updated.tenantId ?? ""), "usage.usersCount": { $gt: 0 } },
    { $inc: { "usage.usersCount": -1 } }
  );

  await createAuditLog({
    tenantId: String(updated.tenantId ?? ""),
    userId: input.actorId,
    action: "user.removed",
    entityType: "User",
    entityId: targetId,
    message: `User ${String(updated.email ?? "")} removed by super admin`,
    req: input.req,
  });

  const tenants = await tenantsForUsers([updated]);
  return toAdminUser(updated, tenants);
}

export async function resetAdminUserPassword(input: {
  id: string;
  actorId: string;
  req?: import("express").Request;
}): Promise<{ temporaryPassword: string }> {
  if (!mongoose.isValidObjectId(input.id)) throw new ApiError("User not found", 404, "NOT_FOUND");
  const user = (await UserModel.findById(input.id).lean()) as RawUser | null;
  if (!user) throw new ApiError("User not found", 404, "NOT_FOUND");

  const isSelf = String(user._id) === input.actorId;
  if (userIsProtected(user) && !isSelf) {
    throw new ApiError("This protected account cannot be modified.", 403, "PROTECTED_USER");
  }

  const temporaryPassword = generateTempPassword();
  const passwordHash = await hashPassword(temporaryPassword);
  await UserModel.updateOne(
    { _id: input.id },
    {
      $set: { passwordHash, updatedBy: input.actorId },
      $unset: { passwordResetTokenHash: 1, passwordResetExpiresAt: 1 },
    }
  );

  await createAuditLog({
    tenantId: String(user.tenantId ?? ""),
    userId: input.actorId,
    action: "user.password_reset",
    entityType: "User",
    entityId: input.id,
    message: `Password reset for ${String(user.email ?? "")} by super admin`,
    req: input.req,
  });

  return { temporaryPassword };
}
