import { useCallback, useEffect, useState } from "react";
import * as formService from "../services/formService.js";

/**
 * Loads the forms list and exposes the dashboard actions.
 * Updates are applied AFTER the service confirms success ("pessimistic").
 * With Google Sheets as the database, that's more reliable than showing a
 * change first and having to undo it if the save fails.
 * Actions throw on failure; the caller decides how to show the error.
 */
export function useForms() {
  const [forms, setForms] = useState([]);
  const [status, setStatus] = useState("loading"); // "loading" | "ready" | "error"
  const [error, setError] = useState(null);

  // Initial load. `ignore` prevents updating state if the page was left before the data arrived.
  useEffect(() => {
    let ignore = false;
    formService
      .listForms()
      .then((data) => {
        if (ignore) return;
        setForms(data);
        setStatus("ready");
      })
      .catch((err) => {
        if (ignore) return;
        setError(err);
        setStatus("error");
      });
    return () => {
      ignore = true;
    };
  }, []);

  /** Used by the "Try again" button. */
  const reload = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      setForms(await formService.listForms());
      setStatus("ready");
    } catch (err) {
      setError(err);
      setStatus("error");
    }
  }, []);

  const duplicate = useCallback(async (id) => {
    const copy = await formService.duplicateForm(id);
    setForms((list) => [copy, ...list]);
    return copy;
  }, []);

  const remove = useCallback(async (id) => {
    await formService.deleteForm(id);
    setForms((list) => list.filter((form) => form.id !== id));
  }, []);

  const changeStatus = useCallback(async (id, nextStatus) => {
    const updated = await formService.setFormStatus(id, nextStatus);
    setForms((list) => list.map((form) => (form.id === id ? updated : form)));
    return updated;
  }, []);

  return { forms, status, error, reload, duplicate, remove, changeStatus };
}