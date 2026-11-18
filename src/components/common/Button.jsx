import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap select-none " +
  "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 " +
  "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const VARIANTS = {
  primary: "bg-brand-500 text-white shadow-sm hover:bg-brand-600",
  secondary: "border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900",
  ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  danger: "bg-red-600 text-white shadow-sm hover:bg-red-700",
};

const SIZES = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

/**
 * One button for the whole app.
 * - Pass `to` to render a router <Link> styled as a button.
 * - Pass `icon={SomeLucideIcon}` for a leading icon.
 * - Pass `loading` to show a spinner and block clicks (used for saving/submitting later).
 */
export default function Button({
  variant = "primary",
  size = "md",
  to,
  icon: Icon, // renamed to a capital so JSX treats it as a component
  loading = false,
  disabled = false,
  type = "button", // default "button" so buttons inside forms don't submit by accident
  className = "",
  children,
  ...rest
}) {
  const classes = [BASE, VARIANTS[variant], SIZES[size], className].join(" ");

  const content = (
    <>
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        Icon && <Icon className="h-4 w-4" aria-hidden="true" />
      )}
      {children}
    </>
  );

  if (to && !disabled) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {content}
    </button>
  );
}