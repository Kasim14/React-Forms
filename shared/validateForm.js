import { QUESTION_TYPES } from "./questionTypes.js";

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
      const unique = new Set(labels.map((l) => l.toLowerCase()));
      if (unique.size !== labels.length) {
        issues.push({ questionId: question.id, message: `${label} has duplicate answer options.` });
      }
    }
  });

  return issues;
}