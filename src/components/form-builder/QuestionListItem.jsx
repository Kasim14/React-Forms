import { ArrowDown, ArrowUp, Copy, Trash2 } from "lucide-react";
import DropdownMenu from "../common/DropdownMenu.jsx";
import QuestionTypeIcon from "../question-types/QuestionTypeIcon.jsx";
import { QUESTION_TYPES } from "../../../shared/questionTypes.js";

function MoveButton({ label, icon: Icon, disabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-white hover:text-slate-700 disabled:pointer-events-none disabled:opacity-30"
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}

export default function QuestionListItem({ question, index, isFirst, isLast, selected, onSelect, onMove, onDuplicate, onDelete }) {
  const number = index + 1;
  const hasTitle = question.title.trim().length > 0;
  const typeLabel = QUESTION_TYPES[question.type]?.label ?? "Unknown type";

  return (
    <li
      className={`flex items-center gap-1 rounded-lg border transition-colors ${
        selected ? "border-brand-200 bg-brand-50" : "border-transparent hover:bg-slate-50"
      }`}
    >
      {/* The select button and the controls are siblings: buttons must not be nested inside buttons */}
      <button
        type="button"
        onClick={() => onSelect(question.id)}
        aria-current={selected ? "true" : undefined}
        className="flex min-w-0 flex-1 items-center gap-3 rounded-lg px-2 py-2 text-left"
      >
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
            selected ? "bg-brand-500 text-white" : "bg-slate-100 text-slate-600"
          }`}
        >
          <QuestionTypeIcon type={question.type} className="h-3.5 w-3.5" />
        </span>
        <span className="min-w-0">
          <span className={`block truncate text-sm ${hasTitle ? "font-medium text-slate-900" : "italic text-slate-400"}`}>
            {number}. {hasTitle ? question.title : "Untitled question"}
            {question.required && (
              <>
                <span className="text-red-500" aria-hidden="true"> *</span>
                <span className="sr-only"> (required)</span>
              </>
            )}
          </span>
          <span className="block text-xs text-slate-500">{typeLabel}</span>
        </span>
      </button>

      <div className="flex shrink-0 items-center pr-1">
        <MoveButton label={`Move question ${number} up`} icon={ArrowUp} disabled={isFirst} onClick={() => onMove(question.id, -1)} />
        <MoveButton label={`Move question ${number} down`} icon={ArrowDown} disabled={isLast} onClick={() => onMove(question.id, 1)} />
        <DropdownMenu
          label={`More actions for question ${number}`}
          items={[
            { label: "Duplicate", icon: Copy, onClick: () => onDuplicate(question.id) },
            { type: "separator" },
            { label: "Delete", icon: Trash2, danger: true, onClick: () => onDelete(question) },
          ]}
        />
      </div>
    </li>
  );
}