import { useCallback, useMemo, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { ToastContext } from "../../context/toastContext.js";

const DURATION_MS = 3500;
const MAX_VISIBLE = 3;

const TOAST_STYLES = {
  success: { icon: CheckCircle2, iconClass: "text-emerald-500" },
  error: { icon: AlertCircle, iconClass: "text-red-500" },
  info: { icon: Info, iconClass: "text-brand-500" },
};

/** Wrap the app in this once. Any component can then call useToast().success("…"). */
export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((toast) => toast.id !== id));
    clearTimeout(timersRef.current.get(id));
    timersRef.current.delete(id);
  }, []);

  const show = useCallback(
    (type, message) => {
      const id = crypto.randomUUID();
      setToasts((list) => [...list.slice(-(MAX_VISIBLE - 1)), { id, type, message }]);
      timersRef.current.set(id, setTimeout(() => dismiss(id), DURATION_MS));
    },
    [dismiss]
  );

  // useMemo keeps this object stable, so components using it don't re-render needlessly
  const toastApi = useMemo(
    () => ({
      success: (message) => show("success", message),
      error: (message) => show("error", message),
      info: (message) => show("info", message),
    }),
    [show]
  );

  return (
    <ToastContext.Provider value={toastApi}>
      {children}

      {/* aria-live makes screen readers announce new toasts */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6"
      >
        {toasts.map(({ id, type, message }) => {
          const { icon: Icon, iconClass } = TOAST_STYLES[type];
          return (
            <div
              key={id}
              role="status"
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-lg"
            >
              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconClass}`} aria-hidden="true" />
              <p className="flex-1 text-sm text-slate-700">{message}</p>
              <button
                type="button"
                onClick={() => dismiss(id)}
                className="rounded p-0.5 text-slate-400 hover:text-slate-600"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}