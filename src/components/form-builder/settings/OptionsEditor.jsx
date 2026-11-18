import { useEffect, useRef } from "react";
import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import Button from "../../common/Button.jsx";
import { createOption, getOptionKey, MAX_OPTION_LENGTH, MAX_OPTIONS } from "../../../../shared/questionTypes.js";

/** Ids of options whose label (ignoring case/spaces) appears more than once. */
function findDuplicateIds(options) {
  const firstIdByLabel = new Map();
  const duplicates = new Set();
  for (const option of options) {
    const key = option.label.trim().toLowerCase();
    if (!key) continue;
    if (firstIdByLabel.has(key)) {
      duplicates.add(option.id);
      duplicates.add(firstIdByLabel.get(key));
    } else {
      firstIdByLabel.set(key, option.id);
    }
  }
  return duplicates;
}

/** Returns a new list with options for `labels` inserted after `index` (respects MAX_OPTIONS). */
function insertOptions(list, index, labels) {
  const room = Math.max(MAX_OPTIONS - list.length, 0);
  const added = labels.slice(0, room).map((label) => createOption(label.slice(0, MAX_OPTION_LENGTH)));
  const next = [...list];
  next.splice(index + 1, 0, ...added);
  return { next, lastAddedId: added.at(-1)?.id ?? null };
}

function SmallIconButton({ label, icon: Icon, disabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:pointer-events-none disabled:opacity-30"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

/**
 * Keyboard-friendly options list:
 * - Enter       → add a new option below and jump to it
 * - Backspace   → on an empty option, remove it and jump to the one above
 * - Paste lines → each pasted line becomes its own option
 */
export default function OptionsEditor({ options, onChange }) {
  const inputRefs = useRef(new Map()); // option id → <input> element
  const focusAfterRenderRef = useRef(null); // option id to focus once the list re-renders

  // Runs after every render: if we asked to focus an option, do it now that its input exists.
  useEffect(() => {
    const id = focusAfterRenderRef.current;
    if (!id) return;
    focusAfterRenderRef.current = null;
    inputRefs.current.get(id)?.focus();
  });

  const duplicateIds = findDuplicateIds(options);
  const canAdd = options.length < MAX_OPTIONS;

  function addAfter(index) {
    const { next, lastAddedId } = insertOptions(options, index, [""]);
    focusAfterRenderRef.current = lastAddedId;
    onChange(next);
  }

  function updateLabel(id, label) {
    onChange(options.map((option) => (option.id === id ? { ...option, label } : option)));
  }

  function removeAt(index) {
    const next = options.filter((_, i) => i !== index);
    focusAfterRenderRef.current = (next[index - 1] ?? next[0])?.id ?? null;
    onChange(next);
  }

  function moveAt(index, direction) {
    const to = index + direction;
    if (to < 0 || to >= options.length) return;
    const next = [...options];
    [next[index], next[to]] = [next[to], next[index]];
    onChange(next);
  }

  function handleKeyDown(event, index, option) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (canAdd) addAfter(index);
    } else if (event.key === "Backspace" && option.label === "" && options.length > 1) {
      event.preventDefault();
      removeAt(index);
    }
  }

  function handlePaste(event, index, option) {
    const lines = event.clipboardData
      .getData("text")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    if (lines.length < 2) return; // a single line pastes normally

    event.preventDefault();
    let list = options;
    let remaining = lines;

    // If the current option is empty, the first pasted line goes into it.
    if (!option.label.trim()) {
      list = options.map((o) => (o.id === option.id ? { ...o, label: lines[0].slice(0, MAX_OPTION_LENGTH) } : o));
      remaining = lines.slice(1);
    }

    const { next, lastAddedId } = insertOptions(list, index, remaining);
    focusAfterRenderRef.current = lastAddedId ?? option.id;
    onChange(next);
  }

  return (
    <div>
      <ol className="space-y-2">
        {options.map((option, index) => {
          const key = getOptionKey(index);
          const isDuplicate = duplicateIds.has(option.id);
          return (
            <li key={option.id}>
              <div className="flex items-center gap-2">
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-slate-300 text-xs font-semibold text-slate-500"
                  aria-hidden="true"
                >
                  {key}
                </span>
                <input
                  ref={(element) => {
                    if (element) inputRefs.current.set(option.id, element);
                    else inputRefs.current.delete(option.id);
                  }}
                  value={option.label}
                  onChange={(event) => updateLabel(option.id, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(event, index, option)}
                  onPaste={(event) => handlePaste(event, index, option)}
                  maxLength={MAX_OPTION_LENGTH}
                  placeholder={`Option ${index + 1}`}
                  aria-label={`Option ${key}`}
                  aria-invalid={isDuplicate || undefined}
                  className={`h-10 min-w-0 flex-1 rounded-lg border bg-white px-3 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 sm:text-sm ${
                    isDuplicate
                      ? "border-amber-400 focus:border-amber-500 focus:ring-amber-500/20"
                      : "border-slate-300 focus:border-brand-500 focus:ring-brand-500/20"
                  }`}
                />
                <SmallIconButton label={`Move option ${key} up`} icon={ArrowUp} disabled={index === 0} onClick={() => moveAt(index, -1)} />
                <SmallIconButton
                  label={`Move option ${key} down`}
                  icon={ArrowDown}
                  disabled={index === options.length - 1}
                  onClick={() => moveAt(index, 1)}
                />
                <SmallIconButton
                  label={`Remove option ${key}`}
                  icon={X}
                  disabled={options.length <= 1}
                  onClick={() => removeAt(index)}
                />
              </div>
              {isDuplicate && <p className="ml-9 mt-1 text-xs text-amber-700">This option appears more than once.</p>}
            </li>
          );
        })}
      </ol>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <Button variant="secondary" size="sm" icon={Plus} onClick={() => addAfter(options.length - 1)} disabled={!canAdd}>
          Add option
        </Button>
        <p className="text-xs text-slate-500">
          {canAdd
            ? "Tip: press Enter to add the next option, or paste a list (one per line)."
            : `Maximum of ${MAX_OPTIONS} options reached.`}
        </p>
      </div>
    </div>
  );
}