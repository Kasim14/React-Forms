import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FileX, Loader2 } from "lucide-react";
import SurveyRunner from "../components/survey/SurveyRunner.jsx";
import { getPublicForm, submitResponse } from "../services/formService.js";

/** key={slug}: a different link starts a completely fresh survey. */
export default function PublicSurvey() {
  const { slug } = useParams();
  return <PublicSurveyPage key={slug} slug={slug} />;
}

function PublicSurveyPage({ slug }) {
  const [state, setState] = useState({ status: "loading", form: null, error: null });

  useEffect(() => {
    let ignore = false;
    getPublicForm(slug)
      .then((form) => {
        if (!ignore) setState({ status: "ready", form, error: null });
      })
      .catch((error) => {
        if (!ignore) setState({ status: "error", form: null, error });
      });
    return () => {
      ignore = true;
    };
  }, [slug]);

  // Show the form's title in the browser tab
  useEffect(() => {
    if (state.form) document.title = state.form.title;
  }, [state.form]);

  if (state.status === "loading") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-white" role="status">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" aria-hidden="true" />
        <span className="sr-only">Loading form…</span>
      </div>
    );
  }

  if (state.status === "error") {
    const notFound = state.error?.status === 404;
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-white px-6 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <FileX className="h-6 w-6" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-semibold text-slate-900">
          {notFound ? "This form isn't available" : "Something went wrong"}
        </h1>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          {notFound
            ? "It may have been closed, or the link may be incorrect. Please check with the person who shared it."
            : "We couldn't load this form. Please check your connection and refresh the page."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <SurveyRunner form={state.form} mode="live" onSubmit={(payload) => submitResponse(slug, payload)} />
    </div>
  );
}