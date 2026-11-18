import { Search } from "lucide-react";
import Input from "../common/Input.jsx";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Drafts" },
];

export default function FormsToolbar({ search, onSearchChange, filter, onFilterChange, counts }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div
        className="inline-flex self-start rounded-lg border border-slate-200 bg-white p-1 shadow-sm"
        role="group"
        aria-label="Filter forms by status"
      >
        {FILTERS.map(({ value, label }) => {
          const active = filter === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={active}
              onClick={() => onFilterChange(value)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                active ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {label}
              <span className="ml-1.5 text-xs tabular-nums opacity-70">{counts[value]}</span>
            </button>
          );
        })}
      </div>

      <Input
        type="search"
        icon={Search}
        placeholder="Search forms…"
        aria-label="Search forms by name"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        className="w-full sm:w-72"
      />
    </div>
  );
}