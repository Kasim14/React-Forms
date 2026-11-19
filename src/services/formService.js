import { ApiError } from "./apiError.js";
import { SEED_FORMS } from "./mockData.js";
import { createEmptyForm, FORM_STATUS } from "../../shared/formDefaults.js";
import { isValidSlug, makeUniqueSlug, slugify } from "../../shared/slug.js";
import { getPublishIssues } from "../../shared/validateForm.js";
import { findRespondentEmail, validateSubmission } from "../../shared/validateAnswer.js";

/**
 * ⚠️ TEMPORARY MOCK (Phases 2–4).
 * Stores forms and responses in localStorage. In Phase 5 the inside of every
 * function here is replaced with a call to our API. The function names,
 * arguments, return values and thrown ApiErrors stay exactly the same.
 */

const STORAGE_KEY = "reelo-forms:mock-forms:v1";
const RESPONSES_KEY = "reelo-forms:mock-responses:v1";
const FAKE_LATENCY_MS = 350;

let cache = null; // forms, in memory
let responsesCache = null; // responses, in memory

const delay = () => new Promise((resolve) => setTimeout(resolve, FAKE_LATENCY_MS));
const nowIso = () => new Date().toISOString();
const newFormId = () => `frm_${crypto.randomUUID().replaceAll("-", "").slice(0, 12)}`;
const copyOf = (value) => structuredClone(value); // never hand out references to stored objects

/* ---------- Storage helpers ---------- */

function readJson(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null; // corrupt or unavailable storage
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked: data still lives in memory for this session.
  }
}

function loadStore() {
  if (!cache) {
    cache = readJson(STORAGE_KEY) ?? copyOf(SEED_FORMS);
    saveStore();
  }
  return cache;
}

const saveStore = () => writeJson(STORAGE_KEY, cache);

function loadResponses() {
  if (!responsesCache) responsesCache = readJson(RESPONSES_KEY) ?? [];
  return responsesCache;
}

const saveResponses = () => writeJson(RESPONSES_KEY, responsesCache);

function findFormOrThrow(id) {
  const form = loadStore().find((f) => f.id === id);
  if (!form) {
    throw new ApiError("This form doesn't exist or has been deleted.", { status: 404, code: "FORM_NOT_FOUND" });
  }
  return form;
}

const findPublishedBySlug = (slug) =>
  loadStore().find((f) => f.slug === slug && f.status === FORM_STATUS.PUBLISHED) ?? null;

const slugsInUse = (exceptId) => loadStore().filter((f) => f.id !== exceptId).map((f) => f.slug);

/** Only what respondents need. Internal fields (id, counts, dates) never go public. */
const toPublicForm = (form) => ({
  slug: form.slug,
  title: form.title,
  description: form.description,
  questions: form.questions,
  welcomeScreen: form.welcomeScreen,
  thankYouScreen: form.thankYouScreen,
  settings: form.settings,
});

/* ------------------------------------------------------------------ */
/* Admin functions                                                     */
/* ------------------------------------------------------------------ */

/** All forms, newest first, each including `responseCount`. */
export async function listForms() {
  await delay();
  const sorted = [...loadStore()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return copyOf(sorted);
}

export async function getForm(id) {
  await delay();
  return copyOf(findFormOrThrow(id));
}

/** Creates a new draft form with a unique slug. */
export async function createForm(input = {}) {
  await delay();
  const base = createEmptyForm(input);
  const timestamp = nowIso();
  const form = {
    ...base,
    id: newFormId(),
    slug: makeUniqueSlug(base.title, slugsInUse()),
    status: FORM_STATUS.DRAFT,
    createdAt: timestamp,
    updatedAt: timestamp,
    responseCount: 0,
  };
  loadStore().push(form);
  saveStore();
  return copyOf(form);
}

/** Only these fields can be changed through updateForm (id, dates, status, counts cannot). */
const EDITABLE_FIELDS = ["title", "description", "slug", "questions", "welcomeScreen", "thankYouScreen", "settings"];

export async function updateForm(id, changes = {}) {
  await delay();
  const form = findFormOrThrow(id);

  const updates = {};
  for (const key of EDITABLE_FIELDS) {
    if (key in changes) updates[key] = copyOf(changes[key]);
  }

  if ("slug" in updates) {
    updates.slug = slugify(updates.slug);
    if (!isValidSlug(updates.slug)) {
      const message = "Use 3–60 lowercase letters, numbers or hyphens.";
      throw new ApiError(message, { status: 400, code: "INVALID_SLUG", fields: { slug: message } });
    }
    if (slugsInUse(id).includes(updates.slug)) {
      const message = "This URL is already used by another form.";
      throw new ApiError(message, { status: 409, code: "SLUG_TAKEN", fields: { slug: message } });
    }
  }

  Object.assign(form, updates, { updatedAt: nowIso() });
  saveStore();
  return copyOf(form);
}

/** Publish or unpublish. Publishing uses the same rules as the builder (shared/validateForm.js). */
export async function setFormStatus(id, status) {
  await delay();
  if (!Object.values(FORM_STATUS).includes(status)) {
    throw new ApiError("Unknown form status.", { status: 400, code: "INVALID_STATUS" });
  }

  const form = findFormOrThrow(id);
  if (status === FORM_STATUS.PUBLISHED) {
    const issues = getPublishIssues(form);
    if (issues.length > 0) {
      throw new ApiError(issues[0].message, { status: 400, code: "FORM_NOT_READY" });
    }
  }

  form.status = status;
  form.updatedAt = nowIso();
  saveStore();
  return copyOf(form);
}

/** Copies a form as a new draft with no responses. */
export async function duplicateForm(id) {
  await delay();
  const source = findFormOrThrow(id);
  const timestamp = nowIso();
  const title = `${source.title} (Copy)`;

  const copy = {
    ...copyOf(source),
    id: newFormId(),
    title,
    slug: makeUniqueSlug(title, slugsInUse()),
    status: FORM_STATUS.DRAFT,
    createdAt: timestamp,
    updatedAt: timestamp,
    responseCount: 0,
  };

  loadStore().push(copy);
  saveStore();
  return copyOf(copy);
}

export async function deleteForm(id) {
  await delay();
  findFormOrThrow(id);
  cache = loadStore().filter((f) => f.id !== id);
  saveStore();
}

/** Responses for one form, newest first (the Responses page is built in Phase 5). */
export async function listResponses(formId) {
  await delay();
  findFormOrThrow(formId);
  const responses = loadResponses()
    .filter((r) => r.formId === formId)
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  return copyOf(responses);
}

/* ------------------------------------------------------------------ */
/* Public functions (no login needed)                                  */
/* ------------------------------------------------------------------ */

/** A published form by its slug. Drafts and unknown slugs both give 404. */
export async function getPublicForm(slug) {
  await delay();
  const form = findPublishedBySlug(slug);
  if (!form) {
    throw new ApiError("This form isn't available.", { status: 404, code: "FORM_NOT_FOUND" });
  }
  return copyOf(toPublicForm(form));
}

/**
 * Saves a response. Safe to call twice with the same submissionId:
 * the second call is treated as success and saves nothing new.
 */
export async function submitResponse(slug, { submissionId, answers, durationSec } = {}) {
  await delay();

  const form = findPublishedBySlug(slug);
  if (!form) {
    throw new ApiError("This form is no longer accepting responses.", { status: 404, code: "FORM_NOT_FOUND" });
  }
  if (typeof submissionId !== "string" || submissionId.length < 10 || submissionId.length > 100) {
    throw new ApiError("Invalid submission.", { status: 400, code: "INVALID_SUBMISSION" });
  }

  const responses = loadResponses();
  if (responses.some((r) => r.id === submissionId)) {
    return { ok: true, duplicate: true }; // already saved: don't save twice
  }

  const { errors, cleaned } = validateSubmission(form, answers);
  if (Object.keys(errors).length > 0) {
    throw new ApiError("Some answers need your attention.", { status: 400, code: "INVALID_ANSWERS", fields: errors });
  }

  responses.push({
    id: submissionId,
    formId: form.id,
    formTitle: form.title,
    submittedAt: nowIso(),
    respondentEmail: findRespondentEmail(form, cleaned),
    answers: cleaned,
    meta: { durationSec: Number.isFinite(durationSec) ? Math.max(0, Math.round(durationSec)) : null },
  });
  saveResponses();

  form.responseCount = (form.responseCount ?? 0) + 1;
  saveStore();

  return { ok: true, duplicate: false };
}