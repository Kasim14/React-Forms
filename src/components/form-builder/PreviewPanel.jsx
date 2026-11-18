import { useState } from "react";
import { MonitorSmartphone } from "lucide-react";
import QuestionView from "../survey/QuestionView.jsx";

/**
 * Live preview of the selected question, using the real survey components.
 * Answers typed here are kept only in this panel and are never saved.
 */
export default function PreviewPanel({ form, question, index }) {
  const [answers, setAnswers] = useState({});
  const total = form.questions.length;
  const showProgress = form.settings?.showProgress !== false;
  const showNumbers = form.settings?.showQuestionNumbers !== false;

  // Keyed by id AND type: after a type change, the old answer shape is dropped.
  const answerKey = question ? `${question.id}:${question.type}` : null;

  return (
    <section className="rounded-xl border border-slate-200 bg-white lg:sticky lg:top-24" aria-labelledby="preview-heading">
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
        <h2 id="preview-heading" className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <MonitorSmartphone className="h-4 w-4 text-brand-600" aria-hidden="true" />
          Live preview
        </h2>
        <span className="text-xs text-slate-400">Answers here aren't saved</span>
      </div>

      <div className="p-4">
        {/* Phone-sized frame */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {showProgress && question && total > 0 && (
            <div className="h-1 bg-slate-100">
              <div className="h-full bg-brand-500 transition-all" style={{ width: `${((index + 1) / total) * 100}%` }} />
            </div>
          )}

          <div className="min-h-105 px-5 py-8">
            {question ? (
              <>
                <QuestionView
                  question={question}
                  number={showNumbers ? index + 1 : null}
                  value={answers[answerKey]}
                  onChange={(value) => setAnswers((current) => ({ ...current, [answerKey]: value }))}
                />
                {/* Visual only: the real button arrives with the survey in Phase 4 */}
                <div className="mt-8 flex items-center gap-3" aria-hidden="true">
                  <span className="inline-flex h-10 items-center rounded-lg bg-brand-500 px-5 text-sm font-medium text-white">
                    {index === total - 1 ? "Submit" : "OK"}
                  </span>
                  <span className="text-xs text-slate-400">press Enter ↵</span>
                </div>
              </>
            ) : (
              <p className="pt-24 text-center text-sm text-slate-400">Select a question to preview it here.</p>
            )}
          </div>

          {question && (
            <div className="border-t border-slate-100 px-5 py-2 text-xs text-slate-400">
              Question {index + 1} of {total}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}