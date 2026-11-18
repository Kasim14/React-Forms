import { useId } from "react";

/** Multi-line version of Input, with the same label/hint/error behaviour. */
export default function Textarea({ label, hint, error, id, rows = 3, className = "", ...textareaProps }) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const messageId = `${textareaId}-message`;
  const message = error || hint;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={textareaId} className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        className={[
          "block w-full resize-y rounded-lg border bg-white px-3 py-2 text-base text-slate-900 placeholder:text-slate-400",
          "focus:outline-none focus:ring-2 sm:text-sm",
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
            : "border-slate-300 focus:border-brand-500 focus:ring-brand-500/20",
        ].join(" ")}
        {...textareaProps}
      />
      {message && (
        <p id={messageId} className={`mt-1.5 text-sm ${error ? "text-red-600" : "text-slate-500"}`}>
          {message}
        </p>
      )}
    </div>
  );
}