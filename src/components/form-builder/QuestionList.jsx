import { CircleCheck, DoorOpen, Plus, Settings } from "lucide-react";
import Button from "../common/Button.jsx";
import QuestionListItem from "./QuestionListItem.jsx";
import { SECTION } from "./builderSections.js";

function SectionItem({ icon: Icon, label, hint, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={selected ? "true" : undefined}
      className={`flex w-full items-center gap-3 rounded-lg border px-2 py-2 text-left transition-colors ${
        selected ? "border-brand-200 bg-brand-50" : "border-transparent hover:bg-slate-50"
      }`}
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
          selected ? "bg-brand-500 text-white" : "bg-slate-100 text-slate-600"
        }`}
      >
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-slate-900">{label}</span>
        {hint && <span className="block text-xs text-slate-500">{hint}</span>}
      </span>
    </button>
  );
}

export default function QuestionList({
  questions,
  selectedId,
  welcomeEnabled,
  onSelect,
  onAdd,
  onMove,
  onDuplicate,
  onDelete,
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white" aria-labelledby="question-list-heading">
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
        <h2 id="question-list-heading" className="text-sm font-semibold text-slate-900">
          Questions <span className="ml-1 font-normal text-slate-400 tabular-nums">{questions.length}</span>
        </h2>
        <Button size="sm" icon={Plus} onClick={onAdd}>
          Add
        </Button>
      </div>

      <div className="space-y-1 p-2">
        <SectionItem
          icon={DoorOpen}
          label="Welcome screen"
          hint={welcomeEnabled ? "Shown first" : "Turned off"}
          selected={selectedId === SECTION.WELCOME}
          onSelect={() => onSelect(SECTION.WELCOME)}
        />

        {questions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 px-4 py-8 text-center">
            <p className="text-sm font-medium text-slate-900">No questions yet</p>
            <p className="mt-1 text-sm text-slate-500">Start by adding your first question.</p>
            <Button className="mt-4" size="sm" variant="secondary" icon={Plus} onClick={onAdd}>
              Add question
            </Button>
          </div>
        ) : (
          <ol className="space-y-1">
            {questions.map((question, index) => (
              <QuestionListItem
                key={question.id}
                question={question}
                index={index}
                isFirst={index === 0}
                isLast={index === questions.length - 1}
                selected={question.id === selectedId}
                onSelect={onSelect}
                onMove={onMove}
                onDuplicate={onDuplicate}
                onDelete={onDelete}
              />
            ))}
          </ol>
        )}

        <SectionItem
          icon={CircleCheck}
          label="Thank-you screen"
          hint="Shown after submitting"
          selected={selectedId === SECTION.THANK_YOU}
          onSelect={() => onSelect(SECTION.THANK_YOU)}
        />
      </div>

      <div className="border-t border-slate-100 p-2">
        <SectionItem
          icon={Settings}
          label="Form settings"
          hint="URL, description, display"
          selected={selectedId === SECTION.SETTINGS}
          onSelect={() => onSelect(SECTION.SETTINGS)}
        />
      </div>
    </section>
  );
}