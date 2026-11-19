/** Consistent frame for the centre editors (welcome, thank-you, settings). */
export default function EditorCard({ icon: Icon, eyebrow, title, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white" aria-labelledby="editor-card-heading">
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-50 text-brand-600">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{eyebrow}</p>
          <h2 id="editor-card-heading" className="text-sm font-semibold text-slate-900">
            {title}
          </h2>
        </div>
      </div>
      <div className="space-y-5 p-5">{children}</div>
    </section>
  );
}