import { createId } from "./ids.js";

/**
 * THE single source of truth for question types.
 * Read by the form builder, the public survey and (later) the server validator.
 *
 * supportsPlaceholder: the answer box can show grey hint text
 * hasOptions:          the question has a list of answer options
 * defaultSettings:     type-specific settings (edited in Phase 3.2)
 */
export const QUESTION_TYPES = {
  short_text: {
    label: "Short text",
    description: "One-line answer, like a name or city.",
    supportsPlaceholder: true,
    defaultPlaceholder: "Type your answer here…",
    defaultSettings: { maxLength: 255 },
  },
  long_text: {
    label: "Long text",
    description: "Paragraph answer for detailed feedback.",
    supportsPlaceholder: true,
    defaultPlaceholder: "Type your answer here…",
    defaultSettings: { maxLength: 5000 },
  },
  email: {
    label: "Email",
    description: "Collects and checks an email address.",
    supportsPlaceholder: true,
    defaultPlaceholder: "name@example.com",
  },
  phone: {
    label: "Phone number",
    description: "Collects a phone number.",
    supportsPlaceholder: true,
    defaultPlaceholder: "+91 98765 43210",
  },
  number: {
    label: "Number",
    description: "Numeric answer, with optional minimum and maximum.",
    supportsPlaceholder: true,
    defaultPlaceholder: "0",
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

/** How types are grouped in the "Add a question" picker. */
export const QUESTION_TYPE_GROUPS = [
  { label: "Text & contact", types: ["short_text", "long_text", "email", "phone", "number"] },
  { label: "Choice", types: ["multiple_choice", "checkbox", "dropdown", "yes_no"] },
  { label: "Scale", types: ["rating", "opinion_scale"] },
  { label: "Other", types: ["date"] },
];

export const isKnownQuestionType = (type) => Object.hasOwn(QUESTION_TYPES, type);

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