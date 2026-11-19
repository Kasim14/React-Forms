import { ArrowRight, Clock } from "lucide-react";
import { estimateMinutes, getWelcomeContent } from "../../utils/formScreens.js";

export default function WelcomeScreen({ form, onStart }) {
  const { title, description, buttonText } = getWelcomeContent(form);
  const minutes = estimateMinutes(form.questions.length);

  return (
    <div className="text-center">
      <h1 className="break-words text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
      {description && <p className="mt-3 whitespace-pre-line text-base text-slate-500">{description}</p>}

      <div className="mt-8 flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={onStart}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand-500 px-6 text-base font-medium text-white shadow-sm transition-colors hover:bg-brand-600"
        >
          {buttonText}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
        <span className="text-xs text-slate-400">press Enter ↵</span>
      </div>

      <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400">
        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
        Takes about {minutes} min
      </p>
    </div>
  );
}