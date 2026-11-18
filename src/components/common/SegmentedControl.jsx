import { useId } from "react";

/**
 * A row of mutually exclusive choices, e.g. "Number of stars: 3 4 5 6…".
 * Built on real radio buttons, so keyboard arrows and screen readers work for free.
 * options: [{ value, label }]; value can be a number or a string.
 */
export default function SegmentedControl({ label, options, value, onChange }) {
  const name = useId();

  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-medium text-slate-700">{label}</legend>
      <div className="inline-flex flex-wrap gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
        {options.map((option) => {
          const checked = option.value === value;
          return (
            <label
              key={option.value}
              className={`cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium tabular-nums transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-500 ${
                checked ? "bg-white text-brand-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}