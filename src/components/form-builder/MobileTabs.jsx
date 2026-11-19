import { ListOrdered, PencilLine, Smartphone } from "lucide-react";

const MOBILE_TABS = [
  { id: "structure", label: "Questions", icon: ListOrdered },
  { id: "edit", label: "Edit", icon: PencilLine },
  { id: "preview", label: "Preview", icon: Smartphone },
];

/** Bottom tab bar, shown only below 1024px. On desktop all three panels are visible. */
export default function MobileTabs({ active, onChange }) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Builder sections"
    >
      {MOBILE_TABS.map(({ id, label, icon: Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            aria-pressed={isActive}
            className={`flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors ${
              isActive ? "text-brand-600" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            {label}
          </button>
        );
      })}
    </nav>
  );
}