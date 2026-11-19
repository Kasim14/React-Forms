/**
 * What the welcome / thank-you screens actually display, with fallbacks applied.
 * Used by the builder preview now and the public survey in Phase 4.
 */
export function getWelcomeContent(form) {
  const welcome = form.welcomeScreen ?? {};
  return {
    enabled: welcome.enabled !== false,
    title: welcome.title?.trim() || form.title?.trim() || "Untitled form",
    description: welcome.description?.trim() || form.description?.trim() || "",
    buttonText: welcome.buttonText?.trim() || "Start",
  };
}

export function getThankYouContent(form) {
  const thankYou = form.thankYouScreen ?? {};
  return {
    title: thankYou.title?.trim() || "Thank you!",
    description: thankYou.description?.trim() || "",
  };
}

/** Rough completion time: ~20 seconds per question, at least 1 minute. */
export const estimateMinutes = (questionCount) => Math.max(1, Math.round((questionCount * 20) / 60));