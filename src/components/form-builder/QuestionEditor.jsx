import { useState } from "react";
import Input from "../common/Input.jsx";
import Select from "../common/Select.jsx";
import Textarea from "../common/Textarea.jsx";
import Toggle from "../common/Toggle.jsx";
import ConfirmDialog from "../common/ConfirmDialog.jsx";
import QuestionTypeIcon from "../question-types/QuestionTypeIcon.jsx";
import QuestionSettings from "./settings/QuestionSettings.jsx";
import {
  changeQuestionType,
  QUESTION_TYPE_GROUPS,
  QUESTION_TYPES,
  wouldLoseOptions,
} from "../../../shared/questionTypes.js";

export default function QuestionEditor({ question, index, autoFocusTitle, onChange }) {
  const definition = QUESTION_TYPES[question.type];
  const [pendingType, setPendingType] = useState(null); // type waiting for "you'll lose options" confirmation

  // Returns an onChange handler for a text field: field("title") → updates question.title
  const field = (name) => (event) => onChange({ [name]: event.target.value });

  function applyType(newType) {
    onChange(changeQuestionType(question, newType));
    setPendingType(null);
  }

  function requestTypeChange(newType) {
    if (newType === question.type) return;
    if (wouldLoseOptions(question, newType)) setPendingType(newType);
    else applyType(newType);
  }

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

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Select
            label="Question type"
            value={question.type}
            onChange={(event) => requestTypeChange(event.target.value)}
          >
            {QUESTION_TYPE_GROUPS.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.types.map((type) => (
                  <option key={type} value={type}>
                    {QUESTION_TYPES[type].label}
                  </option>
                ))}
              </optgroup>
            ))}
          </Select>

          {definition.supportsPlaceholder && (
            <Input
              label="Placeholder"
              hint="Grey hint text shown before answering."
              maxLength={100}
              value={question.placeholder}
              onChange={field("placeholder")}
            />
          )}
        </div>

        <div className="rounded-lg border border-slate-200 p-4">
          <Toggle
            label="Required"
            description="Respondents must answer this before they can continue."
            checked={question.required}
            onChange={(required) => onChange({ required })}
          />
        </div>

        <QuestionSettings question={question} onChange={onChange} />
      </div>

      <ConfirmDialog
        open={pendingType !== null}
        title="Change question type?"
        description={
          pendingType
            ? `${QUESTION_TYPES[pendingType].label} questions don't use answer options, so this question's options will be removed.`
            : ""
        }
        confirmLabel="Change type"
        tone="primary"
        onConfirm={() => applyType(pendingType)}
        onCancel={() => setPendingType(null)}
      />
    </section>
  );
}