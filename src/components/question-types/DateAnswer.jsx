import { textInputClass } from "./answerStyles.js";

/** Native date picker (calendar on desktop, system wheel on phones). Value: "YYYY-MM-DD". */
export default function DateAnswer({ question, value, onChange, labelledBy }) {
  return (
    <input
      type="date"
      value={typeof value === "string" ? value : ""}
      onChange={(event) => onChange(event.target.value)}
      aria-labelledby={labelledBy}
      aria-required={question.required || undefined}
      className={`${textInputClass} max-w-xs`}
    />
  );
}