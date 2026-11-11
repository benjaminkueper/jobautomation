import { Router } from "express";
import { requireRole } from "../middleware/rbac.middleware";
import { requireSuperAdmin } from "../middleware/super-admin.middleware";
import { getDebugDataCounts, requireAdminResetToken, resetOperationalData, cleanupNonJobIntake, recalculateJobsCount, cleanupTestJobsHandler } from "../controllers/admin.controller";
import {
  createUser,
  deleteUser,
  getTenants,
  getUserStats,
  getUsers,
  resetUserPassword,
  updateUser,
} from "../controllers/user-admin.controller";

export const adminRoutes = Router();

// ─── Platform user management (super admins only) ───────────────────────────
adminRoutes.get("/users", requireSuperAdmin, getUsers);
adminRoutes.get("/users/stats", requireSuperAdmin, getUserStats);
adminRoutes.get("/tenants", requireSuperAdmin, getTenants);
adminRoutes.post("/users", requireSuperAdmin, createUser);
adminRoutes.patch("/users/:id", requireSuperAdmin, updateUser);
adminRoutes.delete("/users/:id", requireSuperAdmin, deleteUser);
adminRoutes.post("/users/:id/reset-password", requireSuperAdmin, resetUserPassword);

adminRoutes.post(
  "/workspace/reset-operational-data",
  requireRole("Owner"),
  requireAdminResetToken,
  resetOperationalData
);

adminRoutes.get(
  "/debug/data-counts",
  requireRole("Owner"),
  requireAdminResetToken,
  getDebugDataCounts
);

adminRoutes.post(
  "/cleanup/non-job-intake-records",
  requireRole("Owner"),
  requireAdminResetToken,
  cleanupNonJobIntake
);

adminRoutes.post(
  "/recalculate/jobs-count",
  requireRole("Owner"),
  requireAdminResetToken,
  recalculateJobsCount
);

adminRoutes.post(
  "/cleanup/test-jobs",
  requireRole("Owner"),
  requireAdminResetToken,
  cleanupTestJobsHandler
);
