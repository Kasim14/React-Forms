import { Lock, Mail } from "lucide-react";
import Logo from "../components/common/Logo.jsx";
import Button from "../components/common/Button.jsx";

export default function Login() {
  // Real login logic arrives in Phase 6. For now this only stops the page reloading.
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">Sign in</h1>
          <p className="mt-1 text-sm text-slate-500">Use your Reelo admin account.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <Field id="email" label="Work email" type="email" icon={Mail} autoComplete="email" placeholder="you@reelo.io" />
            <Field id="password" label="Password" type="password" icon={Lock} autoComplete="current-password" placeholder="••••••••" />

            <Button type="submit" className="w-full" disabled>
              Sign in
            </Button>
            <p className="text-center text-xs text-slate-400">Sign-in is enabled in Phase 6.</p>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ id, label, icon: Icon, ...inputProps }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        <Icon
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        {/* text-base on mobile prevents iOS Safari from zooming in on focus (it zooms when text is under 16px) */}
        <input
          id={id}
          name={id}
          className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 sm:text-sm"
          {...inputProps}
        />
      </div>
    </div>
  );
}