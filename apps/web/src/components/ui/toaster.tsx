"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { subscribeToasts, type ToastPayload } from "@/lib/ui/toast";

const AUTO_DISMISS_MS = 4500;

export function Toaster() {
  const [toasts, setToasts] = useState<ToastPayload[]>([]);

  useEffect(() => {
    const timers = new Map<string, ReturnType<typeof setTimeout>>();

    const unsubscribe = subscribeToasts((toast) => {
      setToasts((prev) => [...prev.filter((item) => item.id !== toast.id), toast].slice(-3));

      const timer = setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== toast.id));
        timers.delete(toast.id);
      }, AUTO_DISMISS_MS);
      timers.set(toast.id, timer);
    });

    return () => {
      unsubscribe();
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-[100] flex flex-col items-center gap-2 px-4 md:inset-x-auto md:right-6 md:bottom-6 md:items-end"
      data-testid="toaster"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role={toast.variant === "error" ? "alert" : "status"}
          aria-live={toast.variant === "error" ? "assertive" : "polite"}
          className={cn(
            "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border bg-card/95 px-4 py-3 text-sm text-card-foreground shadow-lg backdrop-blur",
            toast.variant === "success" && "border-success/40",
            toast.variant === "error" && "border-danger/40",
            toast.variant === "info" && "border-border"
          )}
        >
          <span
            aria-hidden
            className={cn(
              "mt-1.5 h-2 w-2 shrink-0 rounded-full",
              toast.variant === "success" && "bg-success",
              toast.variant === "error" && "bg-danger",
              toast.variant === "info" && "bg-primary"
            )}
          />
          <p className="min-w-0 flex-1 leading-snug">{toast.message}</p>
          <button
            type="button"
            onClick={() => setToasts((prev) => prev.filter((item) => item.id !== toast.id))}
            className="shrink-0 rounded-md px-1 text-base leading-none text-muted-foreground transition hover:text-foreground"
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
