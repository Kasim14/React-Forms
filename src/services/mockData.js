import { createEmptyForm, FORM_STATUS } from "../../shared/formDefaults.js";

/**
 * TEMPORARY sample forms so the dashboard has something to show before
 * Google Sheets is connected. Deleted in Phase 5.
 */
const DAY_MS = 24 * 60 * 60 * 1000;
const daysAgo = (n) => new Date(Date.now() - n * DAY_MS).toISOString();

/** Builds a question object in the same shape the form builder will use. */
function question(id, type, title, { required = false, placeholder = "", options = [], settings = {} } = {}) {
  return {
    id,
    type,
    title,
    description: "",
    required,
    placeholder,
    options: options.map((label, i) => ({ id: `${id}_o${i + 1}`, label })),
    settings,
  };
}

function sampleForm({ id, title, description = "", slug, status, questions, createdDaysAgo, updatedDaysAgo, responseCount }) {
  return {
    ...createEmptyForm({ title }),
    id,
    title,
    description,
    slug,
    status,
    questions,
    createdAt: daysAgo(createdDaysAgo),
    updatedAt: daysAgo(updatedDaysAgo),
    responseCount,
  };
}

export const SEED_FORMS = [
  sampleForm({
    id: "frm_demo_trends",
    title: "Restaurant Trends 2027",
    description: "A short survey on how restaurants plan to grow in 2027.",
    slug: "restaurant-trends-2027",
    status: FORM_STATUS.PUBLISHED,
    createdDaysAgo: 12,
    updatedDaysAgo: 2,
    responseCount: 128,
    questions: [
      question("q_name", "short_text", "What is your restaurant name?", { required: true, placeholder: "e.g. The Curry House" }),
      question("q_type", "multiple_choice", "What type of restaurant do you operate?", {
        required: true,
        options: ["QSR", "Casual dining", "Fine dining", "Cafe", "Cloud kitchen"],
      }),
      question("q_outlets", "number", "How many outlets do you manage?", { required: true, settings: { min: 1 } }),
      question("q_challenge", "long_text", "What is your biggest business challenge?"),
    ],
  }),
  sampleForm({
    id: "frm_demo_feedback",
    title: "Weekend Brunch Feedback",
    slug: "weekend-brunch-feedback",
    status: FORM_STATUS.DRAFT,
    createdDaysAgo: 3,
    updatedDaysAgo: 1,
    responseCount: 0,
    questions: [
      question("q_rating", "rating", "How would you rate your brunch experience?", { required: true, settings: { max: 5 } }),
      question("q_return", "yes_no", "Would you visit us again?", { required: true }),
    ],
  }),
  sampleForm({
    id: "frm_demo_webinar",
    title: "Loyalty Webinar Registration",
    slug: "loyalty-webinar-registration",
    status: FORM_STATUS.PUBLISHED,
    createdDaysAgo: 20,
    updatedDaysAgo: 15,
    responseCount: 42,
    questions: [
      question("q_fullname", "short_text", "Your full name", { required: true }),
      question("q_email", "email", "Your work email", { required: true, placeholder: "name@restaurant.com" }),
    ],
  }),
];