/**
 * The spreadsheet layout. Column ORDER matters: it must match row 1 of each tab exactly.
 * Folders starting with "_" inside /api are not turned into URLs by Vercel,
 * so nothing in api/_lib can be called from the internet directly.
 */
export const SHEETS = Object.freeze({
  FORMS: "Forms",
  RESPONSES: "Responses",
});

export const FORM_COLUMNS = Object.freeze([
  "form_id",
  "title",
  "description",
  "slug",
  "status",
  "questions_json",
  "welcome_screen",
  "thank_you_screen",
  "settings_json",
  "created_by",
  "created_at",
  "updated_at",
]);

export const RESPONSE_COLUMNS = Object.freeze([
  "response_id",
  "form_id",
  "form_title",
  "submitted_at",
  "respondent_email",
  "answers_json",
  "meta_json",
]);

/** Expected header row for each tab, used to check the spreadsheet is set up correctly. */
export const EXPECTED_HEADERS = Object.freeze({
  [SHEETS.FORMS]: FORM_COLUMNS,
  [SHEETS.RESPONSES]: RESPONSE_COLUMNS,
});