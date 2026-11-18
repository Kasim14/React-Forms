import { FileText, Globe, Inbox } from "lucide-react";
import { FORM_STATUS } from "../../../shared/formDefaults.js";

export default function StatsCards({ forms, loading }) {
  const published = forms.filter((form) => form.status === FORM_STATUS.PUBLISHED).length;
  const responses = forms.reduce((sum, form) => sum + (form.responseCount ?? 0), 0);

  const stats = [
    { label: "Total forms", value: forms.length, icon: FileText },
    { label: "Published", value: published, icon: Globe },
    { label: "Responses", value: responses, icon: Inbox },
  ];

  return (
    <dl className="grid grid-cols-3 gap-3 sm:gap-4">
      {stats.map(({ label, value, icon: Icon }) => (
        <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <dt className="truncate text-xs font-medium text-slate-500 sm:text-sm">{label}</dt>
            <Icon className="hidden h-4 w-4 shrink-0 text-slate-400 sm:block" aria-hidden="true" />
          </div>
          <dd className="mt-2 text-xl font-semibold tracking-tight text-slate-900 tabular-nums sm:text-2xl">
            {loading ? (
              <span className="inline-block h-7 w-12 animate-pulse rounded bg-slate-100" aria-label="Loading" />
            ) : (
              value.toLocaleString("en-IN")
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
