import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { getForm, updateForm } from "../services/formService.js";
import { builderReducer, initialBuilderState } from "./formBuilderReducer.js";
import { cloneQuestion, createQuestion } from "../../shared/questionTypes.js";

const AUTOSAVE_DELAY_MS = 1000;

/** The parts of a form the builder edits. Slug and status are saved separately. */
const contentOf = (form) => ({
  title: form.title,
  description: form.description,
  questions: form.questions,
  welcomeScreen: form.welcomeScreen,
  thankYouScreen: form.thankYouScreen,
  settings: form.settings,
});

export function useFormBuilder(formId) {
  const [state, dispatch] = useReducer(builderReducer, initialBuilderState);
  const [loadError, setLoadError] = useState(null);

  // Latest state for async code (timers, awaits) that would otherwise see stale values.
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  });

  const inFlightSaveRef = useRef(null);

  /* ---------- Load ---------- */
  useEffect(() => {
    let ignore = false;
    getForm(formId)
      .then((form) => {
        if (!ignore) dispatch({ type: "LOADED", form });
      })
      .catch((err) => {
        if (!ignore) setLoadError(err);
      });
    return () => {
      ignore = true;
    };
  }, [formId]);

  /* ---------- Save (used by autosave AND by "save before leaving/publishing") ---------- */
  const save = useCallback(async () => {
    // Never run two saves at once: an older save finishing last could overwrite newer data.
    if (inFlightSaveRef.current) await inFlightSaveRef.current.catch(() => {});

    const { form, revision, savedRevision } = stateRef.current;
    if (!form || revision === savedRevision) return; // nothing new to save

    dispatch({ type: "SAVE_START" });
    const request = updateForm(form.id, contentOf(form));
    inFlightSaveRef.current = request;
    try {
      const saved = await request;
      dispatch({ type: "SAVE_SUCCESS", revision, updatedAt: saved.updatedAt });
    } catch (err) {
      dispatch({ type: "SAVE_ERROR", error: err });
      throw err;
    } finally {
      inFlightSaveRef.current = null;
    }
  }, []);

  const { form, revision, savedRevision, saving, saveError, selectedId } = state;
  const isDirty = revision !== savedRevision;

  /* ---------- Autosave: wait until typing pauses, then save ---------- */
  useEffect(() => {
    if (!isDirty || saving || saveError) return;
    const timer = setTimeout(() => {
      save().catch(() => {}); // the error is stored in state and shown in the header
    }, AUTOSAVE_DELAY_MS);
    return () => clearTimeout(timer); // each new edit restarts the countdown
  }, [revision, isDirty, saving, saveError, save]);

  /* ---------- Warn before closing the tab with unsaved changes ---------- */
  useEffect(() => {
    if (!isDirty && !saving) return;
    const onBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty, saving]);

  /* ---------- Actions for components ---------- */
  const actions = useMemo(
    () => ({
      updateForm: (changes) => dispatch({ type: "UPDATE_FORM", changes }),

      addQuestion: (type) => {
        const question = createQuestion(type); // ids are created here, not in the reducer
        dispatch({ type: "ADD_QUESTION", question });
        return question;
      },

      duplicateQuestion: (id) => {
        const original = stateRef.current.form?.questions.find((q) => q.id === id);
        if (!original) return;
        dispatch({ type: "ADD_QUESTION", question: cloneQuestion(original), afterId: id });
      },

      updateQuestion: (id, changes) => dispatch({ type: "UPDATE_QUESTION", id, changes }),
      deleteQuestion: (id) => dispatch({ type: "DELETE_QUESTION", id }),
      moveQuestion: (id, direction) => dispatch({ type: "MOVE_QUESTION", id, direction }),
      selectQuestion: (id) => dispatch({ type: "SELECT_QUESTION", id }),

      applyServerChanges: (changes) => dispatch({ type: "SERVER_UPDATE", changes }),
      retrySave: () => dispatch({ type: "CLEAR_SAVE_ERROR" }), // autosave picks it up again
      flush: save, // save right now and wait (before leaving, previewing or publishing)
    }),
    [save]
  );

  const saveStatus = saveError ? "error" : saving ? "saving" : isDirty ? "unsaved" : "saved";
  const selectedQuestion = form?.questions.find((q) => q.id === selectedId) ?? null;

  return {
    form,
    loading: !form && !loadError,
    loadError,
    selectedId,
    selectedQuestion,
    saveStatus,
    actions,
  };
}