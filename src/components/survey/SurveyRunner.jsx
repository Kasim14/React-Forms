import { useEffect, useRef } from "react";
import { AlertCircle, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import Button from "../common/Button.jsx";
import QuestionView from "./QuestionView.jsx";
import WelcomeScreen from "./WelcomeScreen.jsx";
import ThankYouScreen from "./ThankYouScreen.jsx";
import { useSurvey } from "../../hooks/useSurvey.js";

// Types whose input focuses itself (the cursor goes straight into the box)
const TEXT_ENTRY_TYPES = new Set(["short_text", "long_text", "email", "phone", "number"]);
const NON_TYPING_INPUTS = new Set(["radio", "checkbox", "date"]);

/** True when the key press is the respondent typing into a field (so shortcuts must not fire). */
function isTypingTarget(target) {
  const tag = target?.tagName;
  return tag === "TEXTAREA" || tag === "SELECT" || (tag === "INPUT" && !NON_TYPING_INPUTS.has(target.type));
}

/** "A" → 0, "B" → 1 … */
const optionIndexFromKey = (key) => (/^[A-Z]$/.test(key) ? key.charCodeAt(0) - 65 : -1);

function Alert({ children }) {
  return (
    <p role="alert" className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      {children}
    </p>
  );
}

/**
 * The full respondent experience. Used by the public page (mode "live")
 * and the builder's Preview page (mode "preview").
 */
export default function SurveyRunner({ form, mode = "live", onSubmit, onRestart }) {
  const survey = useSurvey(form, onSubmit);
  const { step, question, index, total } = survey;
  const containerRef = useRef(null);
  const showProgress = form.settings?.showProgress !== false;
  const showNumbers = form.settings?.showQuestionNumbers !== false;

  /* ---------- Keyboard shortcuts ---------- */

  // The listener is added once; it always calls the latest handler through this ref.
  const keyHandlerRef = useRef(null);
  useEffect(() => {
    keyHandlerRef.current = (event) => {
      if (event.defaultPrevented || event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target;
      const typing = isTypingTarget(target);

      if (step === "welcome") {
        if (event.key === "Enter" && target?.tagName !== "BUTTON") {
          event.preventDefault();
          survey.start();
        }
        return;
      }
      if (!question) return;

      if (event.key === "Enter") {
        // Text inputs handle Enter themselves; buttons handle their own Enter.
        if (typing || target?.tagName === "BUTTON") return;
        event.preventDefault();
        survey.goNext();
        return;
      }

      if (typing || target?.type === "date") return;
      const key = event.key.toUpperCase();

      if (question.type === "yes_no") {
        if (key === "Y") survey.answer("yes");
        if (key === "N") survey.answer("no");
        return;
      }

      if (question.type === "multiple_choice" || question.type === "checkbox") {
        const option = question.options[optionIndexFromKey(key)];
        if (!option) return;
        if (question.type === "multiple_choice") {
          survey.answer(option.id);
        } else {
          const selected = Array.isArray(survey.value) ? survey.value : [];
          survey.answer(
            selected.includes(option.id) ? selected.filter((id) => id !== option.id) : [...selected, option.id]
          );
        }
        return;
      }

      if ((question.type === "rating" || question.type === "opinion_scale") && /^\d$/.test(event.key)) {
        const n = Number(event.key);
        const min = question.type === "rating" ? 1 : (question.settings?.min ?? 0);
        const max = question.settings?.max ?? (question.type === "rating" ? 5 : 10);
        if (n >= min && n <= max) survey.answer(n);
      }
    };
  });

  useEffect(() => {
    const listener = (event) => keyHandlerRef.current?.(event);
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, []);

  /* ---------- Focus: move to each new step so keyboard & screen-reader users follow along ---------- */

  useEffect(() => {
    if (question && TEXT_ENTRY_TYPES.has(question.type)) return; // the input focuses itself
    containerRef.current?.focus({ preventScroll: true });
  }, [step, question]);

  /* ---------- What to show ---------- */

  if (total === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 text-center text-slate-500">
        This form doesn't have any questions yet.
      </div>
    );
  }

  const progress = step === "done" ? 100 : index >= 0 ? ((index + 1) / total) * 100 : 0;

  let content;
  if (step === "welcome") {
    content = <WelcomeScreen form={form} onStart={survey.start} />;
  } else if (step === "done") {
    content = (
      <div>
        <ThankYouScreen form={form} />
        {mode === "preview" && onRestart && (
          <div className="mt-8 flex justify-center">
            <Button variant="secondary" icon={RotateCcw} onClick={onRestart}>
              Restart preview
            </Button>
          </div>
        )}
      </div>
    );
  } else if (question) {
    content = (
      <>
        <QuestionView
          size="lg"
          question={question}
          number={showNumbers ? index + 1 : null}
          value={survey.value}
          onChange={survey.answer}
          onEnter={survey.goNext}
          autoFocus={TEXT_ENTRY_TYPES.has(question.type)}
        />

        {survey.error && <Alert>{survey.error}</Alert>}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button size="lg" onClick={survey.goNext} loading={survey.submitting}>
            {survey.isLast ? (survey.submitting ? "Submitting…" : "Submit") : "OK"}
          </Button>
          {!survey.submitting && (
            <span className="hidden text-sm text-slate-400 sm:inline">
              press <strong className="font-medium text-slate-500">Enter ↵</strong>
            </span>
          )}
        </div>

        {survey.submitError && <Alert>{survey.submitError}</Alert>}
      </>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col bg-white">
      {showProgress && (
        <div
          className="sticky top-0 z-10 h-1 bg-slate-100"
          role="progressbar"
          aria-label="Form progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
        >
          <div className="h-full bg-brand-500 transition-[width] duration-500" style={{ width: `${progress}%` }} />
        </div>
      )}

      <main className="flex flex-1 items-center justify-center px-5 py-16 sm:px-8">
        {/* key={step}: a new element per step, which replays the slide-in animation */}
        <div
          key={String(step)}
          ref={containerRef}
          tabIndex={-1}
          className={`w-full max-w-xl focus:outline-none motion-reduce:animate-none ${
            survey.direction === "back" ? "animate-survey-back" : "animate-survey-forward"
          }`}
        >
          {content}
        </div>
      </main>

      {question && (
        <div className="fixed bottom-4 right-4 z-10 flex overflow-hidden rounded-lg shadow-md">
          <button
            type="button"
            onClick={survey.goBack}
            disabled={!survey.canGoBack || survey.submitting}
            aria-label="Previous question"
            className="bg-brand-500 p-2.5 text-white transition-colors hover:bg-brand-600 disabled:opacity-40"
          >
            <ChevronUp className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={survey.goNext}
            disabled={survey.submitting}
            aria-label={survey.isLast ? "Submit" : "Next question"}
            className="border-l border-brand-600 bg-brand-500 p-2.5 text-white transition-colors hover:bg-brand-600 disabled:opacity-40"
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>
      )}

      <p className="pointer-events-none fixed bottom-5 left-5 text-xs text-slate-400">
        Powered by <span className="font-semibold text-brand-600">Reelo Forms</span>
      </p>
    </div>
  );
}