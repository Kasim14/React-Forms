import { createId } from "./ids.js";

/* ---------- Limits (used by the builder UI and by validation) ---------- */
export const MAX_OPTIONS = 50;
export const MAX_OPTION_LENGTH = 200;
export const RATING_LIMITS = { min: 3, max: 10 };
export const OPINION_SCALE_LIMITS = { startValues: [0, 1], endMin: 5, endMax: 10 };

/** Yes/No answers are stored as "yes" / "no". */
export const YES_NO_OPTIONS = [
  { id: "yes", label: "Yes" },
  { id: "no", label: "No" },
];

/**
 * THE single source of truth for question types.
 * Read by the form builder, the public survey and (later) the server validator.
 *
 * supportsPlaceholder: the answer box can show grey hint text
 * hasOptions:          the question has a list of answer options
 * maxLengthLimit:      hard character limit for typed answers
 * defaultSettings:     type-specific settings for new questions
 */
export const QUESTION_TYPES = {
  short_text: {
    label: "Short text",
    description: "One-line answer, like a name or city.",
    supportsPlaceholder: true,
    defaultPlaceholder: "Type your answer here…",
    maxLengthLimit: 255,
    defaultSettings: { maxLength: null }, // null = up to maxLengthLimit
  },
  long_text: {
    label: "Long text",
    description: "Paragraph answer for detailed feedback.",
    supportsPlaceholder: true,
    defaultPlaceholder: "Type your answer here…",
    maxLengthLimit: 5000,
    defaultSettings: { maxLength: null },
  },
  email: {
    label: "Email",
    description: "Collects and checks an email address.",
    supportsPlaceholder: true,
    defaultPlaceholder: "name@example.com",
    maxLengthLimit: 254,
  },
  phone: {
    label: "Phone number",
    description: "Collects a phone number.",
    supportsPlaceholder: true,
    defaultPlaceholder: "+91 98765 43210",
    maxLengthLimit: 20,
  },
  number: {
    label: "Number",
    description: "Numeric answer, with optional minimum and maximum.",
    supportsPlaceholder: true,
    defaultPlaceholder: "0",
    maxLengthLimit: 30,
    defaultSettings: { min: null, max: null },
  },
  multiple_choice: {
    label: "Multiple choice",
    description: "Pick one option from a list.",
    hasOptions: true,
  },
  checkbox: {
    label: "Checkboxes",
    description: "Pick one or more options.",
    hasOptions: true,
  },
  dropdown: {
    label: "Dropdown",
    description: "Pick one option from a long list.",
    hasOptions: true,
    supportsPlaceholder: true,
    defaultPlaceholder: "Select an option",
  },
  yes_no: {
    label: "Yes / No",
    description: "A simple yes or no answer.",
  },
  rating: {
    label: "Rating",
    description: "Star rating, for example 1 to 5.",
    defaultSettings: { max: 5 },
  },
  opinion_scale: {
    label: "Opinion scale",
    description: "Pick a number on a scale, for example 0 to 10.",
    defaultSettings: { min: 0, max: 10, minLabel: "", maxLabel: "" },
  },
  date: {
    label: "Date",
    description: "Pick a date from a calendar.",
  },
};

/** How types are grouped in the "Add a question" picker and the type selector. */
export const QUESTION_TYPE_GROUPS = [
  { label: "Text & contact", types: ["short_text", "long_text", "email", "phone", "number"] },
  { label: "Choice", types: ["multiple_choice", "checkbox", "dropdown", "yes_no"] },
  { label: "Scale", types: ["rating", "opinion_scale"] },
  { label: "Other", types: ["date"] },
];

export const isKnownQuestionType = (type) => Object.hasOwn(QUESTION_TYPES, type);

/** A, B, C … Z, then 27, 28 … (shown next to options, and used as keyboard shortcuts in Phase 4) */
export const getOptionKey = (index) => (index < 26 ? String.fromCharCode(65 + index) : String(index + 1));

export function createOption(label = "") {
  return { id: createId("o"), label };
}

/** A brand-new question of the given type, with sensible defaults. */
export function createQuestion(type) {
  const definition = QUESTION_TYPES[type];
  if (!definition) throw new Error(`Unknown question type: ${type}`);

  return {
    id: createId("q"),
    type,
    title: "",
    description: "",
    required: false,
    placeholder: definition.supportsPlaceholder ? (definition.defaultPlaceholder ?? "") : "",
    options: definition.hasOptions ? [createOption("Option 1"), createOption("Option 2")] : [],
    settings: structuredClone(definition.defaultSettings ?? {}),
  };
}

/** Copy of a question with fresh ids (for the question itself and every option). */
export function cloneQuestion(question) {
  return {
    ...structuredClone(question),
    id: createId("q"),
    options: question.options.map((option) => createOption(option.label)),
  };
}

/**
 * Converts a question to another type, keeping what still makes sense:
 * id, title, description, required, a custom placeholder, and options
 * (when moving between choice types). Settings reset to the new type's defaults.
 */
export function changeQuestionType(question, newType) {
  if (question.type === newType) return question;
  const from = QUESTION_TYPES[question.type];
  const to = QUESTION_TYPES[newType];
  if (!to) throw new Error(`Unknown question type: ${newType}`);

  const fresh = createQuestion(newType);
  const hasCustomPlaceholder =
    from?.supportsPlaceholder && question.placeholder && question.placeholder !== from.defaultPlaceholder;
  const canKeepOptions = from?.hasOptions && to.hasOptions && question.options.length > 0;

  return {
    ...fresh,
    id: question.id,
    title: question.title,
    description: question.description,
    required: question.required,
    placeholder: to.supportsPlaceholder && hasCustomPlaceholder ? question.placeholder : fresh.placeholder,
    options: canKeepOptions ? question.options : fresh.options,
  };
}

/** True if switching type would throw away answer options the user has typed. */
export function wouldLoseOptions(question, newType) {
  return (
    Boolean(QUESTION_TYPES[question.type]?.hasOptions) &&
    !QUESTION_TYPES[newType]?.hasOptions &&
    question.options.some((option) => option.label.trim())
  );
}