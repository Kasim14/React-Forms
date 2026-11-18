import { Link } from "react-router-dom";
import { Link2, Loader2 } from "lucide-react";
import Badge from "../common/Badge.jsx";
import FormActionsMenu from "./FormActionsMenu.jsx";
import { ROW_GRID } from "./layout.js";
import { formatDate } from "../../utils/formatDate.js";
import { FORM_STATUS } from "../../../shared/formDefaults.js";

function StatusBadge({ status }) {
  return status === FORM_STATUS.PUBLISHED ? (
    <Badge tone="success" dot>Published</Badge>
  ) : (
    <Badge tone="neutral" dot>Draft</Badge>
  );
}

/**
 * Desktop: one row with columns. Mobile: a compact card
 * (title on top, status/responses/date underneath).
 */
export default function FormRow({ form, busy, handlers }) {
  const isPublished = form.status === FORM_STATUS.PUBLISHED;
  const questionCount = form.questions?.length ?? 0;
  const responses = (form.responseCount ?? 0).toLocaleString("en-IN");

  return (
    <li
      className={`flex items-start gap-3 px-4 py-4 transition-colors hover:bg-slate-50 first:rounded-t-xl last:rounded-b-xl md:px-5 md:first:rounded-t-none ${ROW_GRID}`}
    >
      {/* Name + slug (+ mobile meta) */}
      <div className="min-w-0 flex-1">
        <Link
          to={`/forms/${form.id}/edit`}
          className="block truncate text-sm font-semibold text-slate-900 hover:text-brand-700"
        >
          {form.title || "Untitled form"}
        </Link>
        <p className="mt-0.5 truncate text-xs text-slate-500">
          /f/{form.slug} · {questionCount} question{questionCount === 1 ? "" : "s"}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 md:hidden">
          <StatusBadge status={form.status} />
          <span>{responses} responses</span>
          <span>Created {formatDate(form.createdAt)}</span>
        </div>
      </div>

      {/* Desktop-only columns */}
      <div className="hidden md:block">
        <StatusBadge status={form.status} />
      </div>
      <div className="hidden text-sm text-slate-700 tabular-nums md:block">{responses}</div>
      <div className="hidden text-sm text-slate-500 md:block">{formatDate(form.createdAt)}</div>

      {/* Actions */}
      <div className="flex shrink-0 items-center justify-end gap-1">
        {busy ? (
          <Loader2 className="m-2 h-4 w-4 animate-spin text-slate-400" aria-label="Working…" />
        ) : (
          <>
            {isPublished && (
              <button
                type="button"
                onClick={() => handlers.onCopyLink(form)}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-brand-700"
                aria-label={`Copy public link for ${form.title}`}
                title="Copy public link"
              >
                <Link2 className="h-4 w-4" />
              </button>
            )}
            <FormActionsMenu form={form} handlers={handlers} />
          </>
        )}
      </div>
    </li>
  );
}