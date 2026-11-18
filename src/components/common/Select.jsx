import { useId } from "react";
import { ChevronDown } from "lucide-react";

/** Native <select> (best on mobile: uses the phone's own picker), styled to match Input. */
export default function Select({ label, hint, id, className = "", children, ...selectProps }) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className="h-10 w-full cursor-pointer appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-9 text-base text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 sm:text-sm"
          {...selectProps}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
      </div>
      {hint && <p className="mt-1.5 text-sm text-slate-500">{hint}</p>}
    </div>
  );
}