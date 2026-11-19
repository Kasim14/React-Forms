/** Statuses visible in the app. ("deleted" will exist only inside the backend.) */
export const FORM_STATUS = Object.freeze({
  DRAFT: "draft",
  PUBLISHED: "published",
});

/**
 * The starting content of every new form.
 * The service (and later the API) adds: id, slug, status, createdAt, updatedAt.
 * Empty welcome title/description = fall back to the form's title/description.
 */
export function createEmptyForm({ title = "Untitled form" } = {}) {
  return {
    title,
    description: "",
    questions: [],
    welcomeScreen: {
      enabled: true,
      title: "",
      description: "",
      buttonText: "Start",
    },
    thankYouScreen: {
      title: "Thank you!",
      description: "Your response has been recorded.",
    },
    settings: {
      showProgress: true,
      showQuestionNumbers: true,
    },
  };
}