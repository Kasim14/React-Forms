import { Plus } from "lucide-react";
import Button from "../common/Button.jsx";
import QuestionListItem from "./QuestionListItem.jsx";

export default function QuestionList({ questions, selectedId, onSelect, onAdd, onMove, onDuplicate, onDelete }) {
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

      {questions.length === 0 ? (
        <div className="px-4 py-10 text-center">
          <p className="text-sm font-medium text-slate-900">No questions yet</p>
          <p className="mt-1 text-sm text-slate-500">Start by adding your first question.</p>
          <Button className="mt-4" size="sm" variant="secondary" icon={Plus} onClick={onAdd}>
            Add question
          </Button>
        </div>
      ) : (
        <ol className="space-y-1 p-2">
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
    </section>
  );
}