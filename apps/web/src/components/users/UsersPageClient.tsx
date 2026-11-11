"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  CloseIcon,
  LoaderIcon,
  PlusIcon,
  RefreshIcon,
  RotateCcwIcon,
  SearchIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingState } from "@/components/shared/LoadingState";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAuthSession } from "@/context/AuthSessionContext";
import { useAdminUsers } from "@/hooks/api/useAdminUsers";
import { useTranslation } from "@/i18n/useTranslation";
import {
  createAdminUser,
  removeAdminUser,
  resetAdminUserPassword,
  updateAdminUser,
} from "@/lib/api/admin-users.api";
import { cn } from "@/lib/utils";
import {
  ADMIN_USER_ROLES,
  ADMIN_USER_STATUSES,
  type AdminUser,
  type AdminUserRole,
  type AdminUserStatus,
} from "@/types/admin-user";

type Feedback = { type: "success" | "error"; message: string } | null;

type AddFormState = {
  name: string;
  email: string;
  workspaceId: string;
  role: AdminUserRole;
  password: string;
};

type EditFormState = {
  name: string;
  role: AdminUserRole;
  status: AdminUserStatus;
};

type CredentialState = {
  title: string;
  description: string;
  password: string;
};

const EMPTY_ADD_FORM: AddFormState = {
  name: "",
  email: "",
  workspaceId: "",
  role: "Member",
  password: "",
};

const PAGE_SIZE = 10;

function formatDate(value: string | undefined, locale: string, never: string) {
  if (!value) return never;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return never;
  return new Intl.DateTimeFormat(locale === "de" ? "de-DE" : "en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function initialsFor(name: string, email: string) {
  const source = name.trim() || email;
  const parts = source.split(/[\s@._-]+/).filter(Boolean);
  const initials = `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
  return initials || "?";
}

function statusVariant(status: AdminUserStatus): "success" | "warning" | "danger" | "default" {
  if (status === "Active") return "success";
  if (status === "Invited") return "warning";
  if (status === "Suspended") return "danger";
  return "default";
}

function errorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message.trim()) return error.message;
  return fallback;
}

function StatCard({
  label,
  value,
  icon,
  loading,
}: {
  label: string;
  value: number | undefined;
  icon: React.ReactNode;
  loading: boolean;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-1)] p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-bg)] text-[var(--accent-hi)]">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-4)]">{label}</p>
        <p className="text-[22px] font-bold leading-tight text-[var(--text-1)]">
          {loading && value === undefined ? "…" : (value ?? 0)}
        </p>
      </div>
    </div>
  );
}

export function UsersPageClient() {
  const { t, locale } = useTranslation();
  const session = useAuthSession();
  const currentUserId = session?.user.id;

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState<AddFormState>(EMPTY_ADD_FORM);
  const [addError, setAddError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>({ name: "", role: "Member", status: "Active" });
  const [editError, setEditError] = useState<string | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const [resetTarget, setResetTarget] = useState<AdminUser | null>(null);
  const [resetting, setResetting] = useState(false);

  const [removeTarget, setRemoveTarget] = useState<AdminUser | null>(null);
  const [removing, setRemoving] = useState(false);

  const [credential, setCredential] = useState<CredentialState | null>(null);
  const [copied, setCopied] = useState(false);

  const query = useAdminUsers({
    search: search || undefined,
    role: roleFilter,
    status: statusFilter,
    page,
    limit: PAGE_SIZE,
  });

  const data = query.data;
  const users = data?.users ?? [];
  const tenants = data?.tenants ?? [];
  const stats = data?.stats;
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const addModalOpenedRef = useRef(false);
  useEffect(() => {
    if (addModalOpenedRef.current) return;
    addModalOpenedRef.current = true;
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("add") === "1") {
      setAddOpen(true);
      window.history.replaceState({}, "", "/users");
    }
  }, []);

  useEffect(() => {
    if (!addOpen || addForm.workspaceId) return;
    const firstTenant = tenants[0];
    if (!firstTenant) return;
    setAddForm((form) => (form.workspaceId ? form : { ...form, workspaceId: firstTenant.id }));
  }, [addOpen, addForm.workspaceId, tenants]);

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(null), 6000);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const roleOptions = useMemo(
    () => [
      { label: t("usersAdmin.allRoles"), value: "all" },
      ...ADMIN_USER_ROLES.map((role) => ({ label: t(`usersAdmin.roles.${role}`), value: role })),
    ],
    [t]
  );

  const statusOptions = useMemo(
    () => [
      { label: t("usersAdmin.allStatuses"), value: "all" },
      ...ADMIN_USER_STATUSES.map((status) => ({ label: t(`usersAdmin.statuses.${status}`), value: status })),
    ],
    [t]
  );

  const formRoleOptions = useMemo(
    () => ADMIN_USER_ROLES.map((role) => ({ label: t(`usersAdmin.roles.${role}`), value: role })),
    [t]
  );

  const formStatusOptions = useMemo(
    () => ADMIN_USER_STATUSES.map((status) => ({ label: t(`usersAdmin.statuses.${status}`), value: status })),
    [t]
  );

  const workspaceOptions = useMemo(
    () =>
      tenants.map((tenant) => ({
        label: tenant.name,
        value: tenant.id,
      })),
    [tenants]
  );

  function refresh() {
    void query.refetch();
  }

  function openAddModal() {
    const firstTenant = tenants[0];
    setAddForm({
      ...EMPTY_ADD_FORM,
      workspaceId: firstTenant?.id ?? "",
    });
    setAddError(null);
    setAddOpen(true);
  }

  function openEditModal(user: AdminUser) {
    setEditing(user);
    setEditForm({ name: user.name, role: user.role, status: user.status });
    setEditError(null);
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAddError(null);

    if (!addForm.name.trim() || !addForm.email.trim() || !addForm.workspaceId) {
      setAddError(t("usersAdmin.form.required"));
      return;
    }
    if (addForm.password && addForm.password.length < 8) {
      setAddError(t("usersAdmin.form.passwordTooShort"));
      return;
    }

    setCreating(true);
    try {
      const result = await createAdminUser({
        name: addForm.name.trim(),
        email: addForm.email.trim(),
        tenantId: addForm.workspaceId,
        role: addForm.role,
        ...(addForm.password ? { password: addForm.password } : {}),
      });
      setAddOpen(false);
      setAddForm(EMPTY_ADD_FORM);
      await query.refetch();
      if (result.temporaryPassword) {
        setCredential({
          title: t("usersAdmin.createSuccessWithPassword"),
          description: t("usersAdmin.reset.successDesc"),
          password: result.temporaryPassword,
        });
      } else {
        setFeedback({ type: "success", message: t("usersAdmin.createSuccess") });
      }
    } catch (error) {
      setAddError(errorMessage(error, t("usersAdmin.errors.create")));
    } finally {
      setCreating(false);
    }
  }

  async function handleEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    setEditError(null);

    if (!editForm.name.trim()) {
      setEditError(t("usersAdmin.form.required"));
      return;
    }

    setSavingEdit(true);
    try {
      await updateAdminUser(editing.id, {
        name: editForm.name.trim(),
        role: editForm.role,
        status: editForm.status,
      });
      setEditing(null);
      await query.refetch();
      setFeedback({ type: "success", message: t("usersAdmin.updateSuccess") });
    } catch (error) {
      setEditError(errorMessage(error, t("usersAdmin.errors.update")));
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleReset() {
    if (!resetTarget) return;
    setResetting(true);
    try {
      const result = await resetAdminUserPassword(resetTarget.id);
      setResetTarget(null);
      setCredential({
        title: t("usersAdmin.reset.successTitle"),
        description: t("usersAdmin.reset.successDesc"),
        password: result.temporaryPassword,
      });
    } catch (error) {
      setResetTarget(null);
      setFeedback({ type: "error", message: errorMessage(error, t("usersAdmin.errors.reset")) });
    } finally {
      setResetting(false);
    }
  }

  async function handleRemove() {
    if (!removeTarget) return;
    setRemoving(true);
    try {
      await removeAdminUser(removeTarget.id);
      setRemoveTarget(null);
      await query.refetch();
      setFeedback({ type: "success", message: t("usersAdmin.remove.success") });
    } catch (error) {
      setRemoveTarget(null);
      setFeedback({ type: "error", message: errorMessage(error, t("usersAdmin.errors.remove")) });
    } finally {
      setRemoving(false);
    }
  }

  async function copyCredential() {
    if (!credential) return;
    try {
      await navigator.clipboard.writeText(credential.password);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);
  const initialLoading = query.loading && !data;

  function renderActions(user: AdminUser) {
    const isSelf = user.id === currentUserId;
    const locked = user.isProtected && !isSelf;
    return (
      <div className="flex flex-wrap items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => openEditModal(user)}
          disabled={locked}
          title={locked ? t("usersAdmin.badges.protected") : t("usersAdmin.actions.edit")}
        >
          {t("usersAdmin.actions.edit")}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setResetTarget(user)}
          disabled={locked}
          aria-label={t("usersAdmin.actions.resetPassword")}
          title={t("usersAdmin.actions.resetPassword")}
        >
          <RotateCcwIcon size={16} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setRemoveTarget(user)}
          disabled={locked || isSelf}
          aria-label={t("usersAdmin.actions.remove")}
          title={t("usersAdmin.actions.remove")}
          className="text-[var(--rose)] hover:text-[var(--rose)]"
        >
          <CloseIcon size={16} />
        </Button>
      </div>
    );
  }

  function renderUserIdentity(user: AdminUser) {
    const isSelf = user.id === currentUserId;
    return (
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent-bg)] text-[12px] font-bold text-[var(--accent-hi)]">
          {initialsFor(user.name, user.email)}
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="truncate text-[13px] font-semibold text-[var(--text-1)]">{user.name}</p>
            {isSelf ? <Badge variant="outline">{t("usersAdmin.badges.you")}</Badge> : null}
            {user.isSuperAdmin && !isSelf ? (
              <Badge variant="success">
                <ShieldCheckIcon size={12} className="mr-1" />
                {t("usersAdmin.badges.superAdmin")}
              </Badge>
            ) : null}
          </div>
          <p className="truncate text-[12px] text-[var(--text-3)]">{user.email}</p>
          <p className="truncate text-[11px] text-[var(--text-4)]">{user.workspaceName}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-4 sm:space-y-5">
      <PageHeader
        title={t("usersAdmin.title")}
        description={t("usersAdmin.description")}
        actions={
          <>
            <Button type="button" variant="outline" size="sm" onClick={refresh} disabled={query.loading}>
              <RefreshIcon size={15} className={cn("mr-1.5", query.loading && "animate-spin")} />
              {t("usersAdmin.refresh")}
            </Button>
            <Button type="button" size="sm" onClick={openAddModal}>
              <PlusIcon size={15} className="mr-1.5" />
              {t("usersAdmin.addUser")}
            </Button>
          </>
        }
      />

      {feedback ? (
        <div
          role="status"
          className={cn(
            "flex items-start gap-2 rounded-xl border px-3.5 py-3 text-[13px]",
            feedback.type === "success"
              ? "border-[rgba(56,199,147,0.28)] bg-[var(--emerald-bg)] text-[var(--emerald)]"
              : "border-[rgba(229,88,109,0.28)] bg-[var(--rose-bg)] text-[var(--rose)]"
          )}
        >
          {feedback.type === "success" ? (
            <CheckCircleIcon size={16} className="mt-0.5 shrink-0" />
          ) : (
            <AlertTriangleIcon size={16} className="mt-0.5 shrink-0" />
          )}
          <p className="min-w-0 flex-1">{feedback.message}</p>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="-m-1 shrink-0 rounded p-1 opacity-70 hover:opacity-100"
            aria-label={t("usersAdmin.actions.close")}
          >
            <CloseIcon size={14} />
          </button>
        </div>
      ) : null}

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        <StatCard label={t("usersAdmin.stats.total")} value={stats?.total} icon={<UsersIcon size={18} />} loading={query.loading} />
        <StatCard label={t("usersAdmin.stats.active")} value={stats?.active} icon={<CheckCircleIcon size={18} />} loading={query.loading} />
        <StatCard label={t("usersAdmin.stats.invited")} value={stats?.invited} icon={<PlusIcon size={18} />} loading={query.loading} />
        <StatCard label={t("usersAdmin.stats.suspended")} value={stats?.suspended} icon={<AlertTriangleIcon size={18} />} loading={query.loading} />
        <StatCard label={t("usersAdmin.stats.workspaces")} value={stats?.workspaces} icon={<ShieldCheckIcon size={18} />} loading={query.loading} />
      </section>

      <section className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-1)]">
        <div className="flex flex-col gap-2.5 border-b border-[var(--border-default)] p-3 sm:flex-row sm:items-center sm:p-4">
          <div className="relative min-w-0 flex-1">
            <SearchIcon
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-4)]"
            />
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder={t("usersAdmin.searchPlaceholder")}
              className="pl-9"
              aria-label={t("usersAdmin.searchPlaceholder")}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
            <Select
              value={roleFilter}
              onChange={(event) => {
                setRoleFilter(event.target.value);
                setPage(1);
              }}
              options={roleOptions}
              aria-label={t("usersAdmin.table.role")}
              className="sm:w-[160px]"
            />
            <Select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setPage(1);
              }}
              options={statusOptions}
              aria-label={t("usersAdmin.table.status")}
              className="sm:w-[160px]"
            />
          </div>
        </div>

        {initialLoading ? (
          <div className="p-4">
            <LoadingState title={t("usersAdmin.loadingTitle")} description={t("usersAdmin.loadingDesc")} />
          </div>
        ) : query.error && !data ? (
          <div className="p-4">
            <div className="flex flex-col items-center gap-3 rounded-xl border border-[rgba(229,88,109,0.28)] bg-[var(--rose-bg)] px-4 py-8 text-center">
              <AlertTriangleIcon size={22} className="text-[var(--rose)]" />
              <p className="text-sm font-medium text-[var(--rose)]">
                {errorMessage(query.error, t("usersAdmin.errors.load"))}
              </p>
              <Button type="button" variant="outline" size="sm" onClick={refresh}>
                {t("usersAdmin.refresh")}
              </Button>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="p-4">
            <EmptyState title={t("usersAdmin.empty.title")} description={t("usersAdmin.empty.desc")} compact />
          </div>
        ) : (
          <>
            <div className="hidden xl:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("usersAdmin.table.user")}</TableHead>
                    <TableHead>{t("usersAdmin.table.role")}</TableHead>
                    <TableHead>{t("usersAdmin.table.status")}</TableHead>
                    <TableHead>{t("usersAdmin.table.lastActive")}</TableHead>
                    <TableHead className="text-right">{t("usersAdmin.table.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="max-w-[280px]">{renderUserIdentity(user)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{t(`usersAdmin.roles.${user.role}`)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(user.status)} className="whitespace-nowrap">
                          {t(`usersAdmin.statuses.${user.status}`)}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-[12px] text-[var(--text-3)]">
                        {formatDate(user.lastLoginAt, locale, t("usersAdmin.never"))}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">{renderActions(user)}</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <ul className="divide-y divide-[var(--border-default)] xl:hidden">
              {users.map((user) => (
                <li key={user.id} className="space-y-3 p-4">
                  {renderUserIdentity(user)}
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{t(`usersAdmin.roles.${user.role}`)}</Badge>
                    <Badge variant={statusVariant(user.status)} className="whitespace-nowrap">
                      {t(`usersAdmin.statuses.${user.status}`)}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[12px] text-[var(--text-3)]">
                      {t("usersAdmin.table.lastActive")}: {formatDate(user.lastLoginAt, locale, t("usersAdmin.never"))}
                    </span>
                    {renderActions(user)}
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-2 border-t border-[var(--border-default)] p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
              <p className="text-[12px] text-[var(--text-3)]">
                {t("usersAdmin.pagination.showing")
                  .replace("{from}", String(from))
                  .replace("{to}", String(to))
                  .replace("{total}", String(total))}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page <= 1 || query.loading}
                >
                  {t("usersAdmin.pagination.prev")}
                </Button>
                <span className="text-[12px] font-medium text-[var(--text-2)]">
                  {t("usersAdmin.pagination.page")
                    .replace("{page}", String(page))
                    .replace("{total}", String(totalPages))}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  disabled={page >= totalPages || query.loading}
                >
                  {t("usersAdmin.pagination.next")}
                </Button>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Add user */}
      <Modal
        isOpen={addOpen}
        onClose={() => {
          if (!creating) setAddOpen(false);
        }}
        title={t("usersAdmin.form.addTitle")}
        description={t("usersAdmin.form.addDesc")}
        size="md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          {addError ? (
            <p className="rounded-lg border border-[rgba(229,88,109,0.28)] bg-[var(--rose-bg)] px-3 py-2 text-[12px] text-[var(--rose)]">
              {addError}
            </p>
          ) : null}
          <div className="space-y-1.5">
            <label htmlFor="user-name" className="text-[12px] font-semibold text-[var(--text-2)]">
              {t("usersAdmin.form.name")}
            </label>
            <Input
              id="user-name"
              value={addForm.name}
              onChange={(event) => setAddForm((form) => ({ ...form, name: event.target.value }))}
              autoComplete="off"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="user-email" className="text-[12px] font-semibold text-[var(--text-2)]">
              {t("usersAdmin.form.email")}
            </label>
            <Input
              id="user-email"
              type="email"
              value={addForm.email}
              onChange={(event) => setAddForm((form) => ({ ...form, email: event.target.value }))}
              autoComplete="off"
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="user-workspace" className="text-[12px] font-semibold text-[var(--text-2)]">
                {t("usersAdmin.form.workspace")}
              </label>
              <Select
                id="user-workspace"
                value={addForm.workspaceId}
                onChange={(event) => setAddForm((form) => ({ ...form, workspaceId: event.target.value }))}
                options={
                  workspaceOptions.length
                    ? workspaceOptions
                    : [{ label: t("usersAdmin.form.noWorkspaces"), value: "" }]
                }
                required
                disabled={!workspaceOptions.length}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="user-role" className="text-[12px] font-semibold text-[var(--text-2)]">
                {t("usersAdmin.form.role")}
              </label>
              <Select
                id="user-role"
                value={addForm.role}
                onChange={(event) => setAddForm((form) => ({ ...form, role: event.target.value as AdminUserRole }))}
                options={formRoleOptions}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="user-password" className="text-[12px] font-semibold text-[var(--text-2)]">
              {t("usersAdmin.form.password")}
            </label>
            <Input
              id="user-password"
              type="text"
              value={addForm.password}
              onChange={(event) => setAddForm((form) => ({ ...form, password: event.target.value }))}
              placeholder={t("usersAdmin.form.passwordHint")}
              autoComplete="new-password"
            />
          </div>
          <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setAddOpen(false)} disabled={creating}>
              {t("usersAdmin.actions.cancel")}
            </Button>
            <Button type="submit" disabled={creating || !workspaceOptions.length}>
              {creating ? (
                <>
                  <LoaderIcon size={15} className="mr-1.5 animate-spin" />
                  {t("usersAdmin.actions.creating")}
                </>
              ) : (
                t("usersAdmin.actions.create")
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit user */}
      <Modal
        isOpen={Boolean(editing)}
        onClose={() => {
          if (!savingEdit) setEditing(null);
        }}
        title={t("usersAdmin.form.editTitle")}
        description={editing?.email}
        size="md"
      >
        <form onSubmit={handleEdit} className="space-y-4">
          {editError ? (
            <p className="rounded-lg border border-[rgba(229,88,109,0.28)] bg-[var(--rose-bg)] px-3 py-2 text-[12px] text-[var(--rose)]">
              {editError}
            </p>
          ) : null}
          <div className="space-y-1.5">
            <label htmlFor="edit-name" className="text-[12px] font-semibold text-[var(--text-2)]">
              {t("usersAdmin.form.name")}
            </label>
            <Input
              id="edit-name"
              value={editForm.name}
              onChange={(event) => setEditForm((form) => ({ ...form, name: event.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="edit-role" className="text-[12px] font-semibold text-[var(--text-2)]">
                {t("usersAdmin.form.role")}
              </label>
              <Select
                id="edit-role"
                value={editForm.role}
                onChange={(event) => setEditForm((form) => ({ ...form, role: event.target.value as AdminUserRole }))}
                options={formRoleOptions}
                disabled={Boolean(editing?.isProtected)}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="edit-status" className="text-[12px] font-semibold text-[var(--text-2)]">
                {t("usersAdmin.form.status")}
              </label>
              <Select
                id="edit-status"
                value={editForm.status}
                onChange={(event) => setEditForm((form) => ({ ...form, status: event.target.value as AdminUserStatus }))}
                options={formStatusOptions}
                disabled={Boolean(editing?.isProtected)}
              />
            </div>
          </div>
          {editing?.isProtected ? (
            <p className="flex items-start gap-2 rounded-lg border border-[var(--border-default)] bg-[var(--surface-2)] px-3 py-2 text-[12px] text-[var(--text-3)]">
              <ShieldCheckIcon size={14} className="mt-0.5 shrink-0 text-[var(--accent-hi)]" />
              {t("usersAdmin.badges.protected")}
            </p>
          ) : null}
          <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setEditing(null)} disabled={savingEdit}>
              {t("usersAdmin.actions.cancel")}
            </Button>
            <Button type="submit" disabled={savingEdit}>
              {savingEdit ? (
                <>
                  <LoaderIcon size={15} className="mr-1.5 animate-spin" />
                  {t("usersAdmin.actions.saving")}
                </>
              ) : (
                t("usersAdmin.actions.save")
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Reset password confirm */}
      <Modal
        isOpen={Boolean(resetTarget)}
        onClose={() => {
          if (!resetting) setResetTarget(null);
        }}
        title={t("usersAdmin.reset.title")}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-[13px] leading-relaxed text-[var(--text-2)]">
            {t("usersAdmin.reset.desc").replace("{name}", resetTarget?.name ?? "")}
          </p>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setResetTarget(null)} disabled={resetting}>
              {t("usersAdmin.actions.cancel")}
            </Button>
            <Button type="button" onClick={handleReset} disabled={resetting}>
              {resetting ? (
                <>
                  <LoaderIcon size={15} className="mr-1.5 animate-spin" />
                  {t("usersAdmin.actions.saving")}
                </>
              ) : (
                t("usersAdmin.actions.confirm")
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Remove confirm */}
      <Modal
        isOpen={Boolean(removeTarget)}
        onClose={() => {
          if (!removing) setRemoveTarget(null);
        }}
        title={t("usersAdmin.remove.title")}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-[13px] leading-relaxed text-[var(--text-2)]">
            {t("usersAdmin.remove.desc").replace("{name}", removeTarget?.name ?? "")}
          </p>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setRemoveTarget(null)} disabled={removing}>
              {t("usersAdmin.actions.cancel")}
            </Button>
            <Button type="button" variant="destructive" onClick={handleRemove} disabled={removing}>
              {removing ? (
                <>
                  <LoaderIcon size={15} className="mr-1.5 animate-spin" />
                  {t("usersAdmin.actions.saving")}
                </>
              ) : (
                t("usersAdmin.actions.remove")
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Temporary password result */}
      <Modal
        isOpen={Boolean(credential)}
        onClose={() => setCredential(null)}
        title={credential?.title ?? ""}
        description={credential?.description}
        size="sm"
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <p className="text-[12px] font-semibold text-[var(--text-2)]">{t("usersAdmin.reset.tempPassword")}</p>
            <div className="flex items-center gap-2 rounded-lg border border-[var(--border-default)] bg-[var(--surface-2)] px-3 py-2">
              <code className="min-w-0 flex-1 break-all font-mono text-[13px] text-[var(--text-1)]">
                {credential?.password}
              </code>
              <Button type="button" variant="outline" size="sm" onClick={copyCredential}>
                {copied ? t("usersAdmin.actions.copied") : t("usersAdmin.actions.copy")}
              </Button>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="button" onClick={() => setCredential(null)}>
              {t("usersAdmin.actions.close")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
