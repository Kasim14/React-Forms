import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import Button from "../components/common/Button.jsx";
import { createForm } from "../services/formService.js";
import { useToast } from "../hooks/useToast.js";

/**
 * Visiting /forms/new creates a draft immediately and opens it in the builder,
 * so every form in the builder always has a real id.
 */
export default function NewForm() {
  const navigate = useNavigate();
  const toast = useToast();
  const startedRef = useRef(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    // In development, StrictMode runs effects twice. This guard stops two forms being created.
    if (startedRef.current) return;
    startedRef.current = true;

    createForm()
      // replace: true → the browser Back button skips /forms/new (which would create another form)
      .then((form) => navigate(`/forms/${form.id}/edit`, { replace: true }))
      .catch((err) => {
        toast.error(err.message || "Couldn't create the form. Please try again.");
        setFailed(true);
      });
  }, [navigate, toast]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-6 text-center">
      {failed ? (
        <>
          <AlertCircle className="h-8 w-8 text-red-500" aria-hidden="true" />
          <p className="text-sm text-slate-600">We couldn't create a new form.</p>
          <Button to="/" variant="secondary" icon={ArrowLeft}>
            Back to forms
          </Button>
        </>
      ) : (
        <>
          <Loader2 className="h-8 w-8 animate-spin text-brand-500" aria-hidden="true" />
          <p className="text-sm text-slate-600" role="status">
            Creating your form…
          </p>
        </>
      )}
    </div>
  );
}