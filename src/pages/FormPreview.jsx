import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Eye, Loader2, RotateCcw } from "lucide-react";
import Button from "../components/common/Button.jsx";
import SurveyRunner from "../components/survey/SurveyRunner.jsx";
import { getForm } from "../services/formService.js";

/** Pretends to submit: nothing is saved in preview mode. */
const fakeSubmit = () => new Promise((resolve) => setTimeout(resolve, 600));

export default function FormPreview() {
  const { id } = useParams();
  const [state, setState] = useState({ status: "loading", form: null, error: null });
  const [runKey, setRunKey] = useState(0); // changing it restarts the survey from scratch

  useEffect(() => {
    let ignore = false;
    getForm(id)
      .then((form) => {
        if (!ignore) setState({ status: "ready", form, error: null });
      })
      .catch((error) => {
        if (!ignore) setState({ status: "error", form: null, error });
      });
    return () => {
      ignore = true;
    };
  }, [id]);

  const restart = () => setRunKey((key) => key + 1);

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <div className="flex items-center justify-between gap-3 bg-brand-950 px-4 py-2 text-sm text-white">
        <span className="flex min-w-0 items-center gap-2">
          <Eye className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="truncate">Preview: responses are not saved</span>
        </span>
        <div className="flex shrink-0 items-center gap-4">
          {state.status === "ready" && (
            <button type="button" onClick={restart} className="flex items-center gap-1.5 font-medium text-brand-200 hover:text-white">
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Restart
            </button>
          )}
          <Link to={`/forms/${id}/edit`} className="font-medium text-brand-200 hover:text-white">
            Back to editor
          </Link>
        </div>
      </div>

      {state.status === "loading" && (
        <div className="flex flex-1 items-center justify-center" role="status">
          <Loader2 className="h-8 w-8 animate-spin text-brand-500" aria-hidden="true" />
          <span className="sr-only">Loading preview…</span>
        </div>
      )}

      {state.status === "error" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-sm text-slate-600">{state.error?.message || "Couldn't load this form."}</p>
          <Button to="/" variant="secondary" icon={ArrowLeft}>
            Back to forms
          </Button>
        </div>
      )}

      {state.status === "ready" && (
        <SurveyRunner key={runKey} form={state.form} mode="preview" onSubmit={fakeSubmit} onRestart={restart} />
      )}
    </div>
  );
}