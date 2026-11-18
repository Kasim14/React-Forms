/** Shared class strings, so every answer type looks consistent. */

export const textInputClass =
  "block w-full border-0 border-b-2 border-slate-300 bg-transparent px-0 py-2 text-lg text-slate-900 placeholder:text-slate-400 transition-colors focus:border-brand-500 focus:outline-none";

export const choiceOptionClass = (selected) =>
  [
    "flex w-full cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-base transition-colors",
    "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-500 has-[:focus-visible]:ring-offset-1",
    selected
      ? "border-brand-500 bg-brand-50 text-brand-900"
      : "border-slate-300 bg-white text-slate-800 hover:border-brand-300 hover:bg-brand-50/40",
  ].join(" ");

export const keyBadgeClass = (selected) =>
  [
    "flex h-6 min-w-6 shrink-0 items-center justify-center rounded border px-1 text-xs font-semibold",
    selected ? "border-brand-500 bg-brand-500 text-white" : "border-slate-300 bg-white text-slate-500",
  ].join(" ");