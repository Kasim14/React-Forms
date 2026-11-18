/**
 * All builder changes go through this reducer.
 * revision       → +1 on every content change
 * savedRevision  → the revision that was last saved successfully
 * When they differ, there are unsaved changes and autosave kicks in.
 * The reducer must stay "pure": no random ids or API calls in here.
 */
export const initialBuilderState = {
  form: null,
  selectedId: null,
  revision: 0,
  savedRevision: 0,
  saving: false,
  saveError: null,
};

/** Applies a content change: bumps the revision and clears any old save error. */
function edit(state, form, extra = {}) {
  return { ...state, ...extra, form, revision: state.revision + 1, saveError: null };
}

export function builderReducer(state, action) {
  const { form } = state;

  switch (action.type) {
    case "LOADED":
      return {
        ...initialBuilderState,
        form: action.form,
        selectedId: action.form.questions[0]?.id ?? null,
      };

    case "UPDATE_FORM":
      return edit(state, { ...form, ...action.changes });

    case "ADD_QUESTION": {
      // Adds after `afterId` if given (used by Duplicate), otherwise at the end.
      const questions = [...form.questions];
      const afterIndex = action.afterId ? questions.findIndex((q) => q.id === action.afterId) : -1;
      const insertAt = afterIndex === -1 ? questions.length : afterIndex + 1;
      questions.splice(insertAt, 0, action.question);
      return edit(state, { ...form, questions }, { selectedId: action.question.id });
    }

    case "UPDATE_QUESTION":
      return edit(state, {
        ...form,
        questions: form.questions.map((q) => (q.id === action.id ? { ...q, ...action.changes } : q)),
      });

    case "DELETE_QUESTION": {
      const index = form.questions.findIndex((q) => q.id === action.id);
      if (index === -1) return state;
      const questions = form.questions.filter((q) => q.id !== action.id);
      // If the deleted question was selected, select its neighbour.
      const selectedId =
        state.selectedId === action.id ? ((questions[index] ?? questions[index - 1])?.id ?? null) : state.selectedId;
      return edit(state, { ...form, questions }, { selectedId });
    }

    case "MOVE_QUESTION": {
      const from = form.questions.findIndex((q) => q.id === action.id);
      const to = from + action.direction; // direction: -1 = up, +1 = down
      if (from === -1 || to < 0 || to >= form.questions.length) return state;
      const questions = [...form.questions];
      [questions[from], questions[to]] = [questions[to], questions[from]];
      return edit(state, { ...form, questions });
    }

    case "SELECT_QUESTION":
      return { ...state, selectedId: action.id };

    case "SAVE_START":
      return { ...state, saving: true, saveError: null };

    case "SAVE_SUCCESS":
      return {
        ...state,
        saving: false,
        savedRevision: action.revision, // the revision that was SENT, not necessarily the latest
        form: { ...form, updatedAt: action.updatedAt },
      };

    case "SAVE_ERROR":
      return { ...state, saving: false, saveError: action.error };

    case "CLEAR_SAVE_ERROR":
      return { ...state, saveError: null };

    // Fields the server changed (e.g. status after publishing). Not a user edit, so no revision bump.
    case "SERVER_UPDATE":
      return { ...state, form: { ...form, ...action.changes } };

    default:
      throw new Error(`Unknown builder action: ${action.type}`);
  }
}