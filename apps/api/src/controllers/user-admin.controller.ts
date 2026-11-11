import type { Request } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { successResponse } from "../utils/apiResponse";
import {
  createAdminUser,
  getAdminUserStats,
  listAdminTenants,
  listAdminUsers,
  removeAdminUser,
  resetAdminUserPassword,
  updateAdminUser,
} from "../services/user-admin.service";

function actorId(req: Request): string {
  return req.user?.id ?? "system";
}

export const getUsers = asyncHandler(async (req: Request, res) => {
  const result = await listAdminUsers({
    search: typeof req.query.search === "string" ? req.query.search : undefined,
    status: typeof req.query.status === "string" ? req.query.status : undefined,
    role: typeof req.query.role === "string" ? req.query.role : undefined,
    page: req.query.page,
    limit: req.query.limit,
  });
  return successResponse(res, result, "Users loaded");
});

export const getUserStats = asyncHandler(async (_req: Request, res) => {
  const stats = await getAdminUserStats();
  return successResponse(res, stats, "User stats loaded");
});

export const getTenants = asyncHandler(async (_req: Request, res) => {
  const tenants = await listAdminTenants();
  return successResponse(res, tenants, "Workspaces loaded");
});

export const createUser = asyncHandler(async (req: Request, res) => {
  const result = await createAdminUser({
    name: req.body?.name,
    email: req.body?.email,
    password: req.body?.password,
    role: req.body?.role,
    tenantId: req.body?.tenantId,
    actorId: actorId(req),
    req,
  });
  return successResponse(res, result, "User created", 201);
});

export const updateUser = asyncHandler(async (req: Request, res) => {
  const user = await updateAdminUser({
    id: req.params.id,
    name: req.body?.name,
    role: req.body?.role,
    status: req.body?.status,
    actorId: actorId(req),
    req,
  });
  return successResponse(res, user, "User updated");
});

export const deleteUser = asyncHandler(async (req: Request, res) => {
  const user = await removeAdminUser({ id: req.params.id, actorId: actorId(req), req });
  return successResponse(res, user, "User removed");
});

export const resetUserPassword = asyncHandler(async (req: Request, res) => {
  const result = await resetAdminUserPassword({ id: req.params.id, actorId: actorId(req), req });
  return successResponse(res, result, "Password reset");
});
