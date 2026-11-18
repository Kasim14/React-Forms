import { useId } from "react";
import { ArrowRight } from "lucide-react";
import QuestionInput from "../question-types/QuestionInput.jsx";

/** One question as respondents see it: number, title, description, answer input. */
export default function QuestionView({ question, number, value, onChange, onEnter, autoFocus = false }) {
  const titleId = useId();
  const title = question.title.trim();

  return (
    <div>
      <div className="flex gap-2">
        {number != null && (
          <span className="mt-1 flex shrink-0 items-center gap-0.5 text-sm font-semibold text-brand-600 tabular-nums">
            {number}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        )}
        <div className="min-w-0">
          <h2 id={titleId} className="break-words text-lg font-semibold leading-snug text-slate-900">
            {title || <span className="italic text-slate-400">Your question here</span>}
            {question.required && (
              <>
                <span className="text-red-500" aria-hidden="true"> *</span>
                <span className="sr-only"> (required)</span>
              </>
            )}
          </h2>
          {question.description.trim() && (
            <p className="mt-1.5 whitespace-pre-line text-sm text-slate-500">{question.description}</p>
          )}
        </div>
      </div>

      <div className="mt-6">
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