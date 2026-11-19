import { useId } from "react";
import { ArrowRight } from "lucide-react";
import QuestionInput from "../question-types/QuestionInput.jsx";

const SIZES = {
  md: { title: "text-lg", description: "text-sm", gap: "mt-6", number: "mt-1 text-sm" },
  lg: { title: "text-2xl sm:text-3xl", description: "text-base sm:text-lg", gap: "mt-8", number: "mt-1.5 text-base sm:mt-2.5" },
};

/** One question as respondents see it: number, title, description, answer input. */
export default function QuestionView({ question, number, value, onChange, onEnter, autoFocus = false, size = "md" }) {
  const titleId = useId();
  const title = question.title.trim();
  const styles = SIZES[size] ?? SIZES.md;

  return (
    <div>
      <div className="flex gap-2">
        {number != null && (
          <span className={`flex shrink-0 items-center gap-0.5 font-semibold text-brand-600 tabular-nums ${styles.number}`}>
            {number}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        )}
        <div className="min-w-0">
          <h2 id={titleId} className={`break-words font-semibold leading-snug text-slate-900 ${styles.title}`}>
            {title || <span className="italic text-slate-400">Your question here</span>}
            {question.required && (
              <>
                <span className="text-red-500" aria-hidden="true"> *</span>
                <span className="sr-only"> (required)</span>
              </>
            )}
          </h2>
          {question.description.trim() && (
            <p className={`mt-1.5 whitespace-pre-line text-slate-500 ${styles.description}`}>{question.description}</p>
          )}
        </div>
      </div>

      <div className={styles.gap}>
        <QuestionInput
          question={question}
          value={value}
          onChange={onChange}
          onEnter={onEnter}
          autoFocus={autoFocus}
          labelledBy={titleId}
        />
      </div>
    </div>
  );
}