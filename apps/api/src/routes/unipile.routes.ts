import { Router } from "express";
import {
  createUnipileConnectHandler,
  disconnectUnipileHandler,
  getUnipileStatusHandler,
  listUnipileFoldersHandler,
  reconcileUnipileHandler,
  scanUnipileHandler,
  testUnipileHandler,
  unipileNotifyHandler,
  unipileWebhookHandler,
} from "../controllers/unipile.controller";
import { requireAnyPermission, requirePermission } from "../middleware/rbac.middleware";

/** Public Unipile callbacks (no JWT). Mount before authMiddleware. */
export const unipilePublicRoutes = Router();
unipilePublicRoutes.post("/notify", unipileNotifyHandler);
unipilePublicRoutes.post("/webhook", unipileWebhookHandler);

/** Authenticated Unipile management routes under /integrations/unipile */
export const unipileProtectedRoutes = Router();
unipileProtectedRoutes.post(
  "/connect",
  requireAnyPermission(["integrations.connect", "settings.read"]),
  createUnipileConnectHandler
);
unipileProtectedRoutes.get("/status", requirePermission("integrations.read"), getUnipileStatusHandler);
unipileProtectedRoutes.get("/health", requirePermission("integrations.read"), testUnipileHandler);
unipileProtectedRoutes.get("/folders", requirePermission("integrations.read"), listUnipileFoldersHandler);
unipileProtectedRoutes.post(
  "/reconcile",
  requireAnyPermission(["integrations.connect", "settings.read"]),
  reconcileUnipileHandler
);
unipileProtectedRoutes.delete(
  "/disconnect",
  requirePermission("integrations.disconnect"),
  disconnectUnipileHandler
);
unipileProtectedRoutes.post("/scan", requirePermission("jobs.create"), scanUnipileHandler);
