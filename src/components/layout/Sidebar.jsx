import { NavLink } from "react-router-dom";
import { LayoutGrid, Plus, LogOut } from "lucide-react";
import Logo from "../common/Logo.jsx";
import Button from "../common/Button.jsx";

// Add future sections (Settings, Team, etc.) here. Nothing else needs to change.
const NAV_ITEMS = [{ to: "/", label: "Forms", icon: LayoutGrid, end: true }];

/**
 * Sidebar content. Used in two places:
 * - fixed on desktop
 * - inside the slide-in drawer on mobile (onNavigate closes the drawer after a click)
 */
export default function Sidebar({ onNavigate }) {
  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-16 shrink-0 items-center border-b border-slate-100 px-5">
        <Logo />
      </div>

      <div className="px-3 pt-4">
        <Button to="/forms/new" icon={Plus} className="w-full" onClick={onNavigate}>
          New form
        </Button>
      </div>

      <nav className="flex-1 space-y-1 px-3 pt-4" aria-label="Main navigation">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end} // "end" = only active on exactly "/", not on every page
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`
            }
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Signed-in user. Becomes real in Phase 6. */}
      <div className="border-t border-slate-100 p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
            RA
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">Reelo Admin</p>
            <p className="truncate text-xs text-slate-500">Signed-in user shows here</p>
          </div>
          <button
            type="button"
            disabled
            title="Sign out (enabled in Phase 6)"
            aria-label="Sign out"
            className="rounded-md p-1.5 text-slate-400 disabled:cursor-not-allowed"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}