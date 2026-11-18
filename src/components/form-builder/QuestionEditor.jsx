import Input from "../common/Input.jsx";
import Textarea from "../common/Textarea.jsx";
import Toggle from "../common/Toggle.jsx";
import QuestionTypeIcon from "../question-types/QuestionTypeIcon.jsx";
import { QUESTION_TYPES } from "../../../shared/questionTypes.js";

/**
 * Edits the fields every question has.
 * Type-specific settings (options, rating, scale…) are added in Phase 3.2.
 */
export default function QuestionEditor({ question, index, autoFocusTitle, onChange }) {
  const definition = QUESTION_TYPES[question.type];
  const hasTypeSettings = definition.hasOptions || Object.keys(definition.defaultSettings ?? {}).length > 0;

  // Returns an onChange handler for a text field: field("title") → updates question.title
  const field = (name) => (event) => onChange({ [name]: event.target.value });

  return (
    <section className="rounded-xl border border-slate-200 bg-white" aria-labelledby="question-editor-heading">
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-50 text-brand-600">
          <QuestionTypeIcon type={question.type} />
        </span>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Question {index + 1}</p>
          <h2 id="question-editor-heading" className="text-sm font-semibold text-slate-900">
            {definition.label}
          </h2>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <Textarea
          label="Question"
          rows={2}
          maxLength={300}
          value={question.title}
          onChange={field("title")}
          placeholder="e.g. What is your restaurant name?"
          autoFocus={autoFocusTitle}
        />

        <Textarea
          label="Description"
          hint="Optional. Extra context shown under the question."
          rows={2}
          maxLength={500}
          value={question.description}
          onChange={field("description")}
        />

        {definition.supportsPlaceholder && (
          <Input
            label="Placeholder"
            hint="Grey hint text shown inside the empty answer box."
            maxLength={100}
            value={question.placeholder}
            onChange={field("placeholder")}
          />
        )}

        <div className="rounded-lg border border-slate-200 p-4">
          <Toggle
            label="Required"
            description="Respondents must answer this before they can continue."
            checked={question.required}
            onChange={(required) => onChange({ required })}
          />
        </div>

        {hasTypeSettings && (
          <p className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-500">
            Answer options and {definition.label.toLowerCase()} settings are added in the next part (Phase 3.2).
          </p>
        )}
      </div>
    </section>
  );
}