import { OPINION_SCALE_LIMITS, QUESTION_TYPES, RATING_LIMITS } from "./questionTypes.js";

const isWholeNumber = (value) => Number.isInteger(value);

/** Problems with one question's type-specific settings. Returns a list of messages. */
function getSettingsIssues(question, definition) {
  const s = question.settings ?? {};
  const issues = [];

  switch (question.type) {
    case "short_text":
    case "long_text":
      if (s.maxLength != null && (!isWholeNumber(s.maxLength) || s.maxLength < 1 || s.maxLength > definition.maxLengthLimit)) {
        issues.push(`character limit must be between 1 and ${definition.maxLengthLimit}`);
      }
      break;

    case "number":
      if (s.min != null && s.max != null && s.min > s.max) {
        issues.push("minimum can't be larger than maximum");
      }
      break;

    case "rating":
      if (!isWholeNumber(s.max) || s.max < RATING_LIMITS.min || s.max > RATING_LIMITS.max) {
        issues.push(`number of stars must be between ${RATING_LIMITS.min} and ${RATING_LIMITS.max}`);
      }
      break;

    case "opinion_scale":
      if (
        !OPINION_SCALE_LIMITS.startValues.includes(s.min) ||
        !isWholeNumber(s.max) ||
        s.max < OPINION_SCALE_LIMITS.endMin ||
        s.max > OPINION_SCALE_LIMITS.endMax
      ) {
        issues.push("scale range is invalid");
      }
      break;

    default:
      break;
  }

  return issues;
}

/**
 * Everything that must be fixed before a form can go live.
 * Returns [] when the form is ready. Used by the builder now and the API in Phase 5.
 * Each issue: { message, questionId? }; questionId lets the builder jump to the problem.
 */
export function getPublishIssues(form) {
  const issues = [];

  if (!form.title?.trim()) {
    issues.push({ message: "Give your form a title before publishing." });
  }

  const questions = form.questions ?? [];
  if (questions.length === 0) {
    issues.push({ message: "Add at least one question before publishing." });
  }

  questions.forEach((question, index) => {
    const label = `Question ${index + 1}`;
    const definition = QUESTION_TYPES[question.type];

    if (!definition) {
      issues.push({ questionId: question.id, message: `${label} has an unknown type.` });
      return;
    }
    if (!question.title?.trim()) {
      issues.push({ questionId: question.id, message: `${label} needs a question title.` });
    }
    if (definition.hasOptions) {
      const labels = question.options.map((o) => o.label.trim()).filter(Boolean);
      if (labels.length < 2) {
        issues.push({ questionId: question.id, message: `${label} needs at least 2 answer options.` });
      }
      if (labels.length !== question.options.length) {
        issues.push({ questionId: question.id, message: `${label} has an empty answer option. Fill it in or remove it.` });
      }
      const unique = new Set(labels.map((l) => l.toLowerCase()));
      if (unique.size !== labels.length) {
        issues.push({ questionId: question.id, message: `${label} has duplicate answer options.` });
      }
    }
    for (const problem of getSettingsIssues(question, definition)) {
      issues.push({ questionId: question.id, message: `${label}: ${problem}.` });
    }
  });

  return issues;
}