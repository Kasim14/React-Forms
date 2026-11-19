/**
 * Besides questions, the builder can select these special sections.
 * They share the same "selectedId" as questions. Question ids always
 * start with "q_", so these can never clash with one.
 */
export const SECTION = Object.freeze({
  WELCOME: "__welcome",
  THANK_YOU: "__thank_you",
  SETTINGS: "__settings",
});