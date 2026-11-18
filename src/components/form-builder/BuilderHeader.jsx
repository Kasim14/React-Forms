import { AlertCircle, ArrowLeft, Check, Eye, EyeOff, Globe, Link2, Loader2 } from "lucide-react";
import Button from "../common/Button.jsx";
import Badge from "../common/Badge.jsx";
import { FORM_STATUS } from "../../../shared/formDefaults.js";

function SaveIndicator({ status, onRetry }) {
  const base = "flex items-center gap-1 text-xs";
  if (status === "saving") {
    return (
      <span className={`${base} text-slate-500`}>
        <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" /> Saving…
      </span>
    );
  }
  if (status === "unsaved") return <span className={`${base} text-slate-500`}>Unsaved changes</span>;
  if (status === "error") {
    return (
      <span className={`${base} text-red-600`}>
        <AlertCircle className="h-3 w-3" aria-hidden="true" /> Couldn't save ·
        <button type="button" onClick={onRetry} className="font-medium underline underline-offset-2">
          Retry
        </button>
      </span>
    );
  }
  return (
    <span className={`${base} text-slate-500`}>
      <Check className="h-3 w-3 text-emerald-500" aria-hidden="true" /> Saved
    </span>
  );
}

export default function BuilderHeader({
  form,
  saveStatus,
  publishing,
  onBack,
  onTitleChange,
  onRetrySave,
  onPreview,
  onCopyLink,
  onTogglePublish,
}) {
  const isPublished = form.status === FORM_STATUS.PUBLISHED;

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
      <div className="flex min-h-14 items-center gap-2 px-3 py-2 sm:px-4">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          aria-label="Back to forms"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="min-w-0 flex-1">
          {/* Looks like text, but it's an input: click the title to rename the form */}
          <input
            value={form.title}
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder="Untitled form"
            aria-label="Form title"
            maxLength={120}
            className="w-full max-w-md truncate rounded-md border border-transparent bg-transparent px-2 py-0.5 text-base font-semibold text-slate-900 placeholder:text-slate-400 hover:border-slate-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 sm:text-sm"
          />
          <div className="flex items-center gap-2 px-2" role="status" aria-live="polite">
            <Badge tone={isPublished ? "success" : "neutral"} dot>
              {isPublished ? "Published" : "Draft"}
            </Badge>
            <SaveIndicator status={saveStatus} onRetry={onRetrySave} />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {isPublished && (
            <Button variant="ghost" size="sm" icon={Link2} onClick={onCopyLink} className="hidden md:inline-flex">
              Copy link
            </Button>
          )}
          <Button variant="secondary" size="sm" icon={Eye} onClick={onPreview} aria-label="Preview form">
            <span className="hidden sm:inline">Preview</span>
          </Button>
          <Button
            size="sm"
            variant={isPublished ? "secondary" : "primary"}
            icon={isPublished ? EyeOff : Globe}
            loading={publishing}
            onClick={onTogglePublish}
          >
            {isPublished ? "Unpublish" : "Publish"}
          </Button>
        </div>
      </div>

      {isPublished && (
        <p className="border-t border-emerald-100 bg-emerald-50 px-4 py-1.5 text-center text-xs text-emerald-800">
          This form is live. Saved changes are visible to respondents straight away.
        </p>
      )}
    </header>
  );
}