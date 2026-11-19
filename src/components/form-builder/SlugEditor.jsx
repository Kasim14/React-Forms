import { useId, useState } from "react";
import { AlertTriangle } from "lucide-react";
import Button from "../common/Button.jsx";
import { FORM_STATUS } from "../../../shared/formDefaults.js";
import { isValidSlug, slugify, SLUG_MAX_LENGTH, SLUG_MIN_LENGTH } from "../../../shared/slug.js";

/**
 * Edits the public URL. Unlike everything else in the builder, this does NOT
 * autosave: a URL change can break shared links, so it needs an explicit "Save URL".
 * The parent gives it key={form.slug}, so it resets after a successful save.
 */
export default function SlugEditor({ form, onSave }) {
  const inputId = useId();
  const [draft, setDraft] = useState(form.slug);
  const [serverError, setServerError] = useState(null);
  const [saving, setSaving] = useState(false);

  const cleaned = slugify(draft); // what will actually be saved
  const changed = cleaned !== form.slug;
  const formatError =
    draft.trim() && !isValidSlug(cleaned)
      ? `Use ${SLUG_MIN_LENGTH}–${SLUG_MAX_LENGTH} lowercase letters, numbers or hyphens.`
      : !draft.trim()
        ? "The URL can't be empty."
        : null;
  const error = formatError || serverError;
  const isPublished = form.status === FORM_STATUS.PUBLISHED;

  async function handleSave() {
    if (!changed || formatError) return;
    setSaving(true);
    setServerError(null);
    try {
      await onSave(cleaned);
    } catch (err) {
      setServerError(err.fields?.slug || err.message || "Couldn't save the URL.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-700">
        Public URL
      </label>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div
          className={`flex min-w-0 flex-1 items-center rounded-lg border bg-white focus-within:ring-2 ${
            error
              ? "border-red-400 focus-within:ring-red-500/20"
              : "border-slate-300 focus-within:border-brand-500 focus-within:ring-brand-500/20"
          }`}
        >
          <span className="max-w-[50%] shrink-0 select-none truncate rounded-l-lg border-r border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
            {window.location.host}/f/
          </span>
          <input
            id={inputId}
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value.toLowerCase());
              setServerError(null);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleSave();
              }
            }}
            maxLength={SLUG_MAX_LENGTH + 10}
            spellCheck={false}
            autoCapitalize="none"
            autoComplete="off"
            aria-invalid={error ? true : undefined}
            className="h-10 min-w-0 flex-1 rounded-r-lg bg-transparent px-3 text-base text-slate-900 focus:outline-none sm:text-sm"
          />
        </div>
        <Button variant="secondary" onClick={handleSave} loading={saving} disabled={!changed || Boolean(formatError)}>
          Save URL
        </Button>
      </div>

      {error ? (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      ) : changed && draft !== cleaned ? (
        <p className="mt-1.5 text-sm text-slate-500">
          Will be saved as <span className="font-medium text-slate-700">{cleaned}</span>
        </p>
      ) : null}

      {isPublished && changed && !formatError && (
        <p className="mt-2 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          This form is live. Changing the URL will break any links you've already shared.
        </p>
      )}
    </div>
  );
}