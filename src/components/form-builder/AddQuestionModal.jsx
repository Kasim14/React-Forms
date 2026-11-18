import Modal from "../common/Modal.jsx";
import QuestionTypeIcon from "../question-types/QuestionTypeIcon.jsx";
import { QUESTION_TYPE_GROUPS, QUESTION_TYPES } from "../../../shared/questionTypes.js";

/** Grid of question types with a plain-English description, so non-technical users can pick easily. */
export default function AddQuestionModal({ open, onClose, onSelect }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add a question"
      description="Choose the kind of answer you want to collect."
      size="lg"
    >
      <div className="space-y-5">
        {QUESTION_TYPE_GROUPS.map((group) => (
          <div key={group.label}>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{group.label}</h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {group.types.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => onSelect(type)}
                  className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 text-left transition-colors hover:border-brand-300 hover:bg-brand-50"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-600">
                    <QuestionTypeIcon type={type} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-slate-900">{QUESTION_TYPES[type].label}</span>
                    <span className="block text-xs text-slate-500">{QUESTION_TYPES[type].description}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}