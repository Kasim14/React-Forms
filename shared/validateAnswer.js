import { QUESTION_TYPES, YES_NO_OPTIONS } from "./questionTypes.js";

/**
 * Answer rules shared by the survey (instant feedback) and the API (final check).
 * Never trust the browser alone: the server runs these same functions again.
 */

const REQUIRED_MESSAGE = "This question is required.";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[\d\s()-]+$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Nothing answered: undefined, null, "", "   " or []. */
export function isAnswerEmpty(value) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "") ||
    (Array.isArray(value) && value.length === 0)
  );
}

/** Returns an error message for the respondent, or null if the answer is fine. */
export function validateAnswer(question, value) {
  const definition = QUESTION_TYPES[question.type];
  if (!definition) return "This question can't be answered.";

  if (isAnswerEmpty(value)) return question.required ? REQUIRED_MESSAGE : null;

  const settings = question.settings ?? {};
  const optionIds = new Set((question.options ?? []).map((o) => o.id));

  switch (question.type) {
    case "short_text":
    case "long_text": {
      if (typeof value !== "string") return "Please enter text.";
      const max = settings.maxLength ?? definition.maxLengthLimit;
      return value.trim().length > max ? `Please keep your answer under ${max} characters.` : null;
    }

    case "email":
      return typeof value === "string" && value.length <= definition.maxLengthLimit && EMAIL_PATTERN.test(value.trim())
        ? null
        : "Please enter a valid email address, like name@example.com.";

    case "phone": {
      if (typeof value !== "string") return "Please enter a valid phone number.";
      const digits = value.replace(/\D/g, "");
      return PHONE_PATTERN.test(value.trim()) && digits.length >= 7 && digits.length <= 15
        ? null
        : "Please enter a valid phone number.";
    }

    case "number": {
      const number = typeof value === "number" ? value : Number(String(value).trim());
      if (!Number.isFinite(number)) return "Please enter a number.";
      if (settings.min != null && number < settings.min) return `Please enter a number of at least ${settings.min}.`;
      if (settings.max != null && number > settings.max) return `Please enter a number no greater than ${settings.max}.`;
      return null;
    }

    case "multiple_choice":
    case "dropdown":
      return optionIds.has(value) ? null : "Please choose one of the options.";

    case "checkbox":
      return Array.isArray(value) && value.every((id) => optionIds.has(id)) && new Set(value).size === value.length
        ? null
        : "Please choose from the options.";

    case "yes_no":
      return YES_NO_OPTIONS.some((option) => option.id === value) ? null : "Please choose Yes or No.";

    case "rating": {
      const max = settings.max ?? 5;
      return Number.isInteger(value) && value >= 1 && value <= max ? null : "Please choose a rating.";
    }

    case "opinion_scale": {
      const min = settings.min ?? 0;
      const max = settings.max ?? 10;
      return Number.isInteger(value) && value >= min && value <= max ? null : "Please choose a number on the scale.";
    }

    case "date":
      return typeof value === "string" && DATE_PATTERN.test(value) && !Number.isNaN(Date.parse(value))
        ? null
        : "Please enter a valid date.";

    default:
      return null;
  }
}

/**
 * Turns a valid raw answer into what we store. Choices are saved as their
 * LABELS (readable in Google Sheets), numbers become real numbers, text is trimmed.
 */
export function normalizeAnswer(question, value) {
  const labelOf = (id) => question.options.find((o) => o.id === id)?.label.trim() ?? "";

  switch (question.type) {
    case "number":
      return Number(value);
    case "multiple_choice":
    case "dropdown":
      return labelOf(value);
    case "checkbox":
      // keep the order the options appear in the form, not the click order
      return question.options.filter((o) => value.includes(o.id)).map((o) => o.label.trim());
    case "yes_no":
      return YES_NO_OPTIONS.find((o) => o.id === value).label;
    case "rating":
    case "opinion_scale":
    case "date":
      return value;
    default:
      return String(value).trim();
  }
}

/**
 * Validates a whole submission against the form.
 * Returns { errors: { questionId: message }, cleaned: { questionId: storedValue } }.
 * Answers for question ids that aren't in the form are ignored.
 */
export function validateSubmission(form, answers) {
  const input = answers && typeof answers === "object" && !Array.isArray(answers) ? answers : {};
  const errors = {};
  const cleaned = {};

  for (const question of form.questions) {
    const value = Object.hasOwn(input, question.id) ? input[question.id] : undefined;
    const message = validateAnswer(question, value);
    if (message) {
      errors[question.id] = message;
    } else if (!isAnswerEmpty(value)) {
      cleaned[question.id] = normalizeAnswer(question, value);
    }
  }

  return { errors, cleaned };
}

/** The first Email-question answer, saved separately as respondent_email. */
export function findRespondentEmail(form, cleanedAnswers) {
  const emailQuestion = form.questions.find((q) => q.type === "email" && cleanedAnswers[q.id]);
  return emailQuestion ? cleanedAnswers[emailQuestion.id] : "";
}