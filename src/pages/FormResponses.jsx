import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AlertTriangle, ArrowLeft, Inbox, Pencil, RefreshCw } from "lucide-react";
import PageHeader from "../components/common/PageHeader.jsx";
import Button from "../components/common/Button.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import { FormsListSkeleton } from "../components/dashboard/FormsList.jsx";
import { getForm, listResponses } from "../services/formService.js";
import { formatDateTime } from "../utils/formatDate.js";

/** Stored answers are already readable (labels, numbers, text); this just formats lists and blanks. */
function formatAnswer(value) {
  if (value === undefined || value === null || value === "") return "—";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  return String(value);
}

/** key={id}: switching forms starts a fresh page. */
export default function FormResponses() {
  const { id } = useParams();
  return <ResponsesPage key={id} formId={id} />;
}

function ResponsesPage({ formId }) {
  const [state, setState] = useState({ status: "loading", form: null, responses: [], error: null });
  const [reloadKey, setReloadKey] = useState(0);

  // Load the form (for question titles) and its responses at the same time.
  useEffect(() => {
    let ignore = false;
    Promise.all([getForm(formId), listResponses(formId)])
      .then(([form, responses]) => {
        if (!ignore) setState({ status: "ready", form, responses, error: null });
      })
      .catch((error) => {
        if (!ignore) setState((current) => ({ ...current, status: "error", error }));
      });
    return () => {
      ignore = true;
    };
  }, [formId, reloadKey]);

  const reload = () => {
    setState((current) => ({ ...current, status: "loading" }));
    setReloadKey((key) => key + 1);
  };

  const backButton = (
    <Button to="/" variant="ghost" size="sm" icon={ArrowLeft} className="-ml-3">
      All forms
    </Button>
  );

  if (state.status === "error") {
    return (
      <div className="space-y-6">
        {backButton}
        <EmptyState
          icon={AlertTriangle}
          title="Couldn't load responses"
          description={state.error?.message || "Please try again."}
          action={<Button variant="secondary" icon={RefreshCw} onClick={reload}>Try again</Button>}
        />
      </div>
    );
  }

  const { form, responses } = state;
  const questions = form?.questions ?? [];
  const loading = state.status === "loading";

  return (
    <div className="space-y-6">
      {backButton}

      <PageHeader
        title={form ? form.title : "Responses"}
        description={
          loading
            ? "Loading responses…"
            : `${responses.length} response${responses.length === 1 ? "" : "s"}` +
              (responses.length ? ` · Latest ${formatDateTime(responses[0].submittedAt)}` : "")
        }
        actions={
          <>
            <Button variant="secondary" size="sm" icon={RefreshCw} onClick={reload} disabled={loading}>
              Refresh
            </Button>
            {form && (
              <Button variant="secondary" size="sm" icon={Pencil} to={`/forms/${form.id}/edit`}>
                Edit form
              </Button>
            )}
          </>
        }
      />

      {loading ? (
        <FormsListSkeleton />
      ) : responses.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No responses yet"
          description="Once people submit this form, their answers will appear here."
        />
      ) : (
        <>
          {/* Desktop: one row per response, one column per question (scrolls sideways) */}
          <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm md:block">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th
                    scope="col"
                    className="sticky left-0 z-10 whitespace-nowrap bg-slate-50 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500"
                  >
                    Submitted
                  </th>
                  {questions.map((question) => (
                    <th key={question.id} scope="col" className="min-w-48 max-w-xs px-4 py-3 text-left text-xs font-medium text-slate-500">
                      <span className="line-clamp-2">{question.title}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {responses.map((response) => (
                  <tr key={response.id} className="align-top">
                    <td className="sticky left-0 whitespace-nowrap bg-white px-4 py-3 text-slate-500">
                      {formatDateTime(response.submittedAt)}
                    </td>
                    {questions.map((question) => (
                      <td key={question.id} className="max-w-xs px-4 py-3 text-slate-800">
                        <span className="line-clamp-3 whitespace-pre-line break-words">
                          {formatAnswer(response.answers[question.id])}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: one card per response */}
          <ul className="space-y-3 md:hidden">
            {responses.map((response) => (
              <li key={response.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-medium text-slate-500">{formatDateTime(response.submittedAt)}</p>
                <dl className="mt-3 space-y-3">
                  {questions.map((question) => (
                    <div key={question.id}>
                      <dt className="text-xs font-medium text-slate-500">{question.title}</dt>
                      <dd className="mt-0.5 whitespace-pre-line break-words text-sm text-slate-900">
                        {formatAnswer(response.answers[question.id])}
                      </dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}