import { useId } from "react";

/**
 * Text input with optional label, leading icon, hint and error message.
 * Labels and errors are linked to the input for screen readers.
 */
export default function Input({ label, hint, error, icon: Icon, id, className = "", ...inputProps }) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;
  const message = error || hint;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
        )}
        {/* text-base on mobile stops iOS Safari zooming in on focus */}
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className={[
            "h-10 w-full rounded-lg border bg-white pr-3 text-base text-slate-900 placeholder:text-slate-400",
            "focus:outline-none focus:ring-2 sm:text-sm",
            Icon ? "pl-9" : "pl-3",
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
              : "border-slate-300 focus:border-brand-500 focus:ring-brand-500/20",
          ].join(" ")}
          {...inputProps}
        />
      </div>

      {message && (
        <p id={messageId} className={`mt-1.5 text-sm ${error ? "text-red-600" : "text-slate-500"}`}>
          {message}
        </p>
      )}
    </div>
  );
}