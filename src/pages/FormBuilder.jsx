import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Eye, ListOrdered, PencilLine, MonitorSmartphone } from "lucide-react";
import Button from "../components/common/Button.jsx";

export default function FormBuilder() {
  const { id } = useParams(); // undefined on /forms/new
  const isNew = !id;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Builder top bar */}
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Back to forms"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              {isNew ? "Untitled form" : `Form ${id}`}
            </p>
            <p className="text-xs text-slate-500">Draft</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={Eye}
            to={isNew ? undefined : `/forms/${id}/preview`}
            disabled={isNew}
          >
            Preview
          </Button>
          <Button size="sm" disabled>
            Publish
          </Button>
        </div>
      </header>

      {/* Three panels: stacked on mobile, side by side from lg (1024px) */}
      <div className="grid flex-1 grid-cols-1 gap-4 p-4 lg:grid-cols-[280px_minmax(0,1fr)_380px]">
        <BuilderPanel icon={ListOrdered} title="Questions" text="Your list of questions will appear here." />
        <BuilderPanel icon={PencilLine} title="Edit question" text="Select a question to edit its details." />
        <BuilderPanel icon={MonitorSmartphone} title="Live preview" text="A live preview of the form will appear here." />
      </div>
    </div>
  );
}

function BuilderPanel({ icon: Icon, title, text }) {
  return (
    <section className="flex min-h-48 flex-col rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
        <Icon className="h-4 w-4 text-brand-600" aria-hidden="true" />
        {title}
      </div>
      <p className="mt-2 text-sm text-slate-500">{text}</p>
    </section>
  );
}