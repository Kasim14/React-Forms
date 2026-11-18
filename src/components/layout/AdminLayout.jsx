import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar.jsx";
import Logo from "../common/Logo.jsx";

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);

  // While the mobile drawer is open: Escape closes it, and the page behind can't scroll.
  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    // Cleanup runs when the drawer closes or the layout unmounts
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop sidebar (lg = 1024px and up) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 lg:block">
        <Sidebar />
      </aside>

      {/* Mobile / tablet top bar */}
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <Logo />
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-slate-900/40" onClick={closeMobile} aria-hidden="true" />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-xl">
            <button
              type="button"
              onClick={closeMobile}
              className="absolute right-3 top-4 z-10 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            <Sidebar onNavigate={closeMobile} />
          </aside>
        </div>
      )}

      {/* Page content. lg:pl-64 makes room for the fixed sidebar. */}
      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}