import { textInputClass } from "./answerStyles.js";
import { QUESTION_TYPES } from "../../../shared/questionTypes.js";

// Right keyboard on phones + browser autofill for each type
const INPUT_PROPS = {
  short_text: { type: "text", autoComplete: "off" },
  email: { type: "email", inputMode: "email", autoComplete: "email", autoCapitalize: "none", spellCheck: false },
  phone: { type: "tel", inputMode: "tel", autoComplete: "tel" },
  // type="text" + numeric keyboard: avoids type="number" quirks (scroll-wheel changes, "e" allowed)
  number: { type: "text", inputMode: "decimal", autoComplete: "off" },
};

const NUMBER_TYPING_PATTERN = /^-?\d*\.?\d*$/; // allows partial input like "-" or "12."

/** Short text, Long text, Email, Phone and Number. */
export default function TextAnswer({ question, value, onChange, onEnter, autoFocus = false, labelledBy }) {
  const text = typeof value === "string" ? value : "";
  const maxLength = question.settings?.maxLength ?? QUESTION_TYPES[question.type].maxLengthLimit;

  const commonProps = {
    value: text,
    placeholder: question.placeholder || undefined,
    maxLength,
    autoFocus,
    "aria-labelledby": labelledBy,
    "aria-required": question.required || undefined,
  };

  if (question.type === "long_text") {
    return (
      <div>
        <textarea
          {...commonProps}
          rows={4}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            // Enter = new line in long answers; Ctrl/Cmd + Enter = continue
            if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
              event.preventDefault();
              onEnter?.();
            }
          }}
          className={`${textInputClass} resize-none`}
        />
        <p className="mt-1 text-right text-xs text-slate-400 tabular-nums">
          {text.length} / {maxLength}
        </p>
      </div>
    );
  }

  return (
    <input
      {...INPUT_PROPS[question.type]}
      {...commonProps}
      onChange={(event) => {
        const next = event.target.value;
        if (question.type === "number" && !NUMBER_TYPING_PATTERN.test(next)) return; // ignore letters
        onChange(next);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          onEnter?.();
        }
      }}
      className={textInputClass}
    />
  );
}