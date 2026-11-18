import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, FileText, Plus, RotateCw, SearchX } from "lucide-react";
import PageHeader from "../components/common/PageHeader.jsx";
import Button from "../components/common/Button.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import StatsCards from "../components/dashboard/StatsCards.jsx";
import FormsToolbar from "../components/dashboard/FormsToolbar.jsx";
import FormsList, { FormsListSkeleton } from "../components/dashboard/FormsList.jsx";
import { useForms } from "../hooks/useForms.js";
import { useToast } from "../hooks/useToast.js";
import { copyToClipboard } from "../utils/clipboard.js";
import { getPublicFormUrl } from "../utils/formUrl.js";
import { FORM_STATUS } from "../../shared/formDefaults.js";

export default function Dashboard() {
  const navigate = useNavigate();
  const toast = useToast();
  const { forms, status, error, reload, duplicate, remove, changeStatus } = useForms();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [busyFormId, setBusyFormId] = useState(null); // row showing a spinner
  const [formToDelete, setFormToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* ---------- Derived data (recalculated only when inputs change) ---------- */

  const counts = useMemo(
    () => ({
      all: forms.length,
      published: forms.filter((f) => f.status === FORM_STATUS.PUBLISHED).length,
      draft: forms.filter((f) => f.status === FORM_STATUS.DRAFT).length,
    }),
    [forms]
  );

  const visibleForms = useMemo(() => {
    const query = search.trim().toLowerCase();
    return forms.filter((form) => {
      const matchesFilter = filter === "all" || form.status === filter;
      const matchesSearch = !query || form.title.toLowerCase().includes(query) || form.slug.includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [forms, search, filter]);

  /* ---------- Actions ---------- */

  /** Runs an action for one row: shows its spinner and turns any error into a toast. */
  async function runRowAction(formId, action) {
    setBusyFormId(formId);
    try {
      await action();
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setBusyFormId(null);
    }
  }

  const handlers = {
    onEdit: (form) => navigate(`/forms/${form.id}/edit`),
    onPreview: (form) => navigate(`/forms/${form.id}/preview`),
    onViewResponses: (form) => navigate(`/forms/${form.id}/responses`),

    onCopyLink: async (form) => {
      const url = getPublicFormUrl(form.slug);
      const copied = await copyToClipboard(url);
      if (copied) toast.success("Public link copied to clipboard.");
      else toast.error(`Couldn't copy automatically. Link: ${url}`);
    },

    onToggleStatus: (form) =>
      runRowAction(form.id, async () => {
        const next = form.status === FORM_STATUS.PUBLISHED ? FORM_STATUS.DRAFT : FORM_STATUS.PUBLISHED;
        await changeStatus(form.id, next);
        toast.success(
          next === FORM_STATUS.PUBLISHED
            ? `"${form.title}" is now live.`
            : `"${form.title}" was unpublished and no longer accepts responses.`
        );
      }),

    onDuplicate: (form) =>
      runRowAction(form.id, async () => {
        const copy = await duplicate(form.id);
        toast.success(`Created "${copy.title}".`);
      }),

    onDelete: (form) => setFormToDelete(form),
  };

  async function confirmDelete() {
    setDeleting(true);
    try {
      await remove(formToDelete.id);
      toast.success(`Deleted "${formToDelete.title}".`);
      setFormToDelete(null);
    } catch (err) {
      toast.error(err.message || "Couldn't delete the form. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  const clearFilters = () => {
    setSearch("");
    setFilter("all");
  };

  /* ---------- Which content to show ---------- */

  let content;
  if (status === "loading") {
    content = <FormsListSkeleton />;
  } else if (forms.length === 0) {
    content = (
      <EmptyState
        icon={FileText}
        title="No forms yet"
        description="Create your first form to start collecting responses. All your forms will appear here."
        action={<Button to="/forms/new" icon={Plus}>Create your first form</Button>}
      />
    );
  } else if (visibleForms.length === 0) {
    content = (
      <EmptyState
        icon={SearchX}
        title="No matching forms"
        description="Try a different search term or status filter."
        action={<Button variant="secondary" onClick={clearFilters}>Clear filters</Button>}
      />
    );
  } else {
    content = <FormsList forms={visibleForms} busyId={busyFormId} handlers={handlers} />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Forms"
        description="Create, publish and manage your Reelo forms."
        actions={<Button to="/forms/new" icon={Plus}>New form</Button>}
      />

      {status === "error" ? (
        <EmptyState
          icon={AlertTriangle}
          title="Couldn't load your forms"
          description={error?.message || "Please check your connection and try again."}
          action={<Button variant="secondary" icon={RotateCw} onClick={reload}>Try again</Button>}
        />
      ) : (
        <>
          <StatsCards forms={forms} loading={status === "loading"} />
          <section className="space-y-4" aria-label="Your forms">
            {status === "ready" && forms.length > 0 && (
              <FormsToolbar
                search={search}
                onSearchChange={setSearch}
                filter={filter}
                onFilterChange={setFilter}
                counts={counts}
              />
            )}
            {content}
          </section>
        </>
      )}

      <ConfirmDialog
        open={Boolean(formToDelete)}
        title="Delete this form?"
        description={
          formToDelete
            ? `"${formToDelete.title}" will be removed from the dashboard and its public link will stop working. Responses already collected stay in Google Sheets.`
            : ""
        }
        confirmLabel="Delete form"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setFormToDelete(null)}
      />
    </div>
  );
}