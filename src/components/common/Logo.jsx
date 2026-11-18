import { ListChecks } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
        <ListChecks className="h-4.5 w-4.5" strokeWidth={2.25} aria-hidden="true" />
      </div>
      <span className="text-[15px] font-semibold tracking-tight text-slate-900">
        Reelo Forms
      </span>
    </div>
  );
}