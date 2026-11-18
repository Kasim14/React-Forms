import FormRow from "./FormRow.jsx";
import { ROW_GRID } from "./layout.js";

export default function FormsList({ forms, busyId, handlers }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Column headings (desktop only) */}
      <div
        className={`hidden border-b border-slate-200 px-5 py-3 text-xs font-medium uppercase tracking-wide text-slate-500 ${ROW_GRID}`}
      >
        <span>Form</span>
        <span>Status</span>
        <span>Responses</span>
        <span>Created</span>
        <span className="sr-only">Actions</span>
      </div>

      <ul className="divide-y divide-slate-100">
        {forms.map((form) => (
          <FormRow key={form.id} form={form} busy={busyId === form.id} handlers={handlers} />
        ))}
      </ul>
    </div>
  );
}

/** Grey placeholder rows shown while forms are loading. */
export function FormsListSkeleton({ rows = 3 }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm" role="status" aria-label="Loading forms">
      <ul className="divide-y divide-slate-100">
        {Array.from({ length: rows }, (_, index) => (
          <li key={index} className="flex items-center gap-4 px-4 py-5 md:px-5">
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 max-w-full animate-pulse rounded bg-slate-100" />
              <div className="h-3 w-32 animate-pulse rounded bg-slate-100" />
            </div>
            <div className="hidden h-5 w-20 animate-pulse rounded-full bg-slate-100 md:block" />
            <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-100" />
          </li>
        ))}
      </ul>
    </div>
  );
}