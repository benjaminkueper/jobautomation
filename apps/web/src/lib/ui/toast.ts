export type ToastVariant = "success" | "error" | "info";

export type ToastPayload = {
  id: string;
  variant: ToastVariant;
  message: string;
};

type ToastListener = (toast: ToastPayload) => void;

const listeners = new Set<ToastListener>();
let counter = 0;

function emit(variant: ToastVariant, message: string) {
  const text = String(message ?? "").trim();
  if (!text) return;

  const payload: ToastPayload = {
    id: `toast-${Date.now()}-${counter++}`,
    variant,
    message: text,
  };

  if (listeners.size === 0) {
    // No mounted host (auth pages, tests): keep a console trail.
    if (variant === "error") console.error(`[error] ${text}`);
    else console.log(`[${variant}] ${text}`);
    return;
  }

  listeners.forEach((listener) => listener(payload));
}

/** Registers a toast host. Returns an unsubscribe function. */
export function subscribeToasts(listener: ToastListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function showSuccess(message: string) {
  emit("success", message);
}

export function showError(message: string) {
  emit("error", message);
}

export function showInfo(message: string) {
  emit("info", message);
}
