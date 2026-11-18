import { useEffect, useId, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";

const ITEM_SELECTOR = '[role="menuitem"]:not([disabled])';

/**
 * "⋯" actions menu.
 * items: [{ label, icon, onClick, danger?, disabled?, hint? } | { type: "separator" }]
 * Keyboard: Enter/Space opens · ↑/↓/Home/End move · Escape closes · Tab away closes.
 */
export default function DropdownMenu({ label, items, icon: TriggerIcon = MoreHorizontal }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    rootRef.current?.querySelector(ITEM_SELECTOR)?.focus(); // focus first item when opened

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const onMenuKeyDown = (event) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const elements = [...event.currentTarget.querySelectorAll(ITEM_SELECTOR)];
    const current = elements.indexOf(document.activeElement);
    const last = elements.length - 1;
    const next = {
      Home: 0,
      End: last,
      ArrowDown: current >= last ? 0 : current + 1,
      ArrowUp: current <= 0 ? last : current - 1,
    }[event.key];
    elements[next]?.focus();
  };

  const selectItem = (item) => {
    setOpen(false);
    item.onClick?.();
  };

  return (
    <div
      ref={rootRef}
      className="relative"
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((isOpen) => !isOpen)}
        className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 aria-expanded:bg-slate-100 aria-expanded:text-slate-900"
      >
        <TriggerIcon className="h-4 w-4" aria-hidden="true" />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={label}
          onKeyDown={onMenuKeyDown}
          className="absolute right-0 top-full z-30 mt-1 w-60 rounded-xl border border-slate-200 bg-white p-1 shadow-lg"
        >
          {items.map((item, index) =>
            item.type === "separator" ? (
              <div key={`separator-${index}`} role="separator" className="my-1 h-px bg-slate-100" />
            ) : (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => selectItem(item)}
                className={[
                  "flex w-full items-start gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  "focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                  item.danger
                    ? "text-red-600 hover:bg-red-50 focus:bg-red-50"
                    : "text-slate-700 hover:bg-slate-100 focus:bg-slate-100",
                ].join(" ")}
              >
                {item.icon && <item.icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />}
                <span className="min-w-0">
                  <span className="block">{item.label}</span>
                  {item.hint && <span className="block text-xs text-slate-400">{item.hint}</span>}
                </span>
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}