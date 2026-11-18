import { ChevronDown } from "lucide-react";
import { getOptionKey } from "../../../shared/questionTypes.js";

/** Native select: on phones this opens the system picker, which handles long lists well. */
export default function DropdownAnswer({ question, value, onChange, labelledBy }) {
  const selected = typeof value === "string" ? value : "";

  return (
    <div className="relative">
      <select
        value={selected}
        onChange={(event) => onChange(event.target.value)}
        aria-labelledby={labelledBy}
        aria-required={question.required || undefined}
        className={`block w-full cursor-pointer appearance-none border-0 border-b-2 border-slate-300 bg-transparent py-2 pl-0 pr-8 text-lg transition-colors focus:border-brand-500 focus:outline-none ${
          selected ? "text-slate-900" : "text-slate-400"
        }`}
      >
        <option value="" disabled>
          {question.placeholder || "Select an option"}
        </option>
        {question.options.map((option, index) => (
          <option key={option.id} value={option.id} className="text-slate-900">
            {option.label.trim() || `Option ${getOptionKey(index)}`}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-0 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
        aria-hidden="true"
      />
    </div>
  );
}