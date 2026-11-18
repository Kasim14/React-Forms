import { useId } from "react";
import { Check } from "lucide-react";
import { choiceOptionClass, keyBadgeClass } from "./answerStyles.js";
import { getOptionKey } from "../../../shared/questionTypes.js";

/**
 * Multiple choice (one answer → option id) or Checkboxes (many → array of ids).
 * Real radio/checkbox inputs are hidden inside big tappable labels.
 */
export default function ChoiceAnswer({ question, value, onChange, labelledBy, multiple = false, keyLabels }) {
  const name = useId();
  const selectedIds = multiple
    ? Array.isArray(value) ? value : []
    : typeof value === "string" ? [value] : [];

  function select(optionId) {
    if (!multiple) {
      onChange(optionId);
      return;
    }
    onChange(
      selectedIds.includes(optionId) ? selectedIds.filter((id) => id !== optionId) : [...selectedIds, optionId]
    );
  }

  return (
    <fieldset aria-labelledby={labelledBy}>
      {multiple && <p className="mb-2 text-sm text-slate-500">Choose as many as you like</p>}
      <div className="space-y-2">
        {question.options.map((option, index) => {
          const selected = selectedIds.includes(option.id);
          const label = option.label.trim();
          return (
            <label key={option.id} className={choiceOptionClass(selected)}>
              <input
                type={multiple ? "checkbox" : "radio"}
                name={name}
                value={option.id}
                checked={selected}
                onChange={() => select(option.id)}
                className="sr-only"
              />
              <span className={keyBadgeClass(selected)} aria-hidden="true">
                {keyLabels?.[index] ?? getOptionKey(index)}
              </span>
              <span className={`min-w-0 flex-1 break-words ${label ? "" : "italic text-slate-400"}`}>
                {label || "Untitled option"}
              </span>
              {selected && <Check className="h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}