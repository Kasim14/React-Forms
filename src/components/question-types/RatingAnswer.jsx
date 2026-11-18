import { useId, useState } from "react";
import { Star } from "lucide-react";

/** Stars 1…max. Value: a number. Hovering previews the rating on desktop. */
export default function RatingAnswer({ question, value, onChange, labelledBy }) {
  const name = useId();
  const max = question.settings?.max ?? 5;
  const selected = Number.isInteger(value) ? value : 0;
  const [hovered, setHovered] = useState(0);
  const highlighted = hovered || selected;

  return (
    <fieldset aria-labelledby={labelledBy}>
      <div className="flex flex-wrap gap-1" onMouseLeave={() => setHovered(0)}>
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
          <label
            key={n}
            onMouseEnter={() => setHovered(n)}
            className="cursor-pointer rounded-md p-1 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-500"
          >
            <input
              type="radio"
              name={name}
              value={n}
              checked={selected === n}
              onChange={() => onChange(n)}
              className="sr-only"
            />
            <Star
              className={`h-8 w-8 transition-colors ${n <= highlighted ? "fill-accent-400 text-accent-400" : "text-slate-300"}`}
              aria-hidden="true"
            />
            <span className="sr-only">
              {n} out of {max}
            </span>
          </label>
        ))}
      </div>
      {selected > 0 && (
        <p className="mt-2 text-sm text-slate-500">
          {selected} out of {max}
        </p>
      )}
    </fieldset>
  );
}