import { useId } from "react";

/** Row of numbers, e.g. 0–10, with optional labels under each end. Value: a number. */
export default function OpinionScaleAnswer({ question, value, onChange, labelledBy }) {
  const name = useId();
  const { min = 0, max = 10, minLabel = "", maxLabel = "" } = question.settings ?? {};
  const values = Array.from({ length: Math.max(max - min + 1, 0) }, (_, i) => min + i);
  const selected = Number.isInteger(value) ? value : null;

  return (
    <fieldset aria-labelledby={labelledBy}>
      {/* One equal-width column per number, so the scale always fits on one line */}
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${values.length}, minmax(0, 1fr))` }}>
        {values.map((n) => {
          const isSelected = selected === n;
          return (
            <label
              key={n}
              className={`flex h-11 cursor-pointer items-center justify-center rounded-md border text-sm font-semibold tabular-nums transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-500 ${
                isSelected
                  ? "border-brand-500 bg-brand-500 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={n}
                checked={isSelected}
                onChange={() => onChange(n)}
                className="sr-only"
              />
              {n}
            </label>
          );
        })}
      </div>
      {(minLabel || maxLabel) && (
        <div className="mt-2 flex justify-between gap-4 text-xs text-slate-500">
          <span>{minLabel}</span>
          <span className="text-right">{maxLabel}</span>
        </div>
      )}
    </fieldset>
  );
}