import { ApiError } from "./apiError.js";
import { SEED_FORMS } from "./mockData.js";
import { createEmptyForm, FORM_STATUS } from "../../shared/formDefaults.js";
import { isValidSlug, makeUniqueSlug, slugify } from "../../shared/slug.js";

/**
 * ⚠️ TEMPORARY MOCK (Phases 2–4).
 * Stores forms in localStorage. In Phase 5 the inside of every function here
 * is replaced with a call to our API. The function names, arguments, return
 * values and thrown ApiErrors stay exactly the same, so components don't change.
 */

const STORAGE_KEY = "reelo-forms:mock-forms:v1";
const FAKE_LATENCY_MS = 350;

let cache = null; // in-memory copy, so the app still works if localStorage is blocked

const delay = () => new Promise((resolve) => setTimeout(resolve, FAKE_LATENCY_MS));
const nowIso = () => new Date().toISOString();
const newFormId = () => `frm_${crypto.randomUUID().replaceAll("-", "").slice(0, 12)}`;
const copyOf = (value) => structuredClone(value); // never hand out references to stored objects

function loadStore() {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      cache = JSON.parse(raw);
      return cache;
    }
  } catch {
    // Corrupt or unavailable storage: fall back to the sample data below.
  }
  cache = copyOf(SEED_FORMS);
  saveStore();
  return cache;
}

function saveStore() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // Storage full or blocked: data still lives in memory for this session.
  }
}

function findFormOrThrow(id) {
  const form = loadStore().find((f) => f.id === id);
  if (!form) {
    throw new ApiError("This form doesn't exist or has been deleted.", { status: 404, code: "FORM_NOT_FOUND" });
  }
  return form;
}

const slugsInUse = (exceptId) => loadStore().filter((f) => f.id !== exceptId).map((f) => f.slug);

/* ------------------------------------------------------------------ */
/* Public functions (this list is the contract the API will match)     */
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

/** Publish or unpublish. A form needs at least one question to be published. */
export async function setFormStatus(id, status) {
  await delay();
  if (!Object.values(FORM_STATUS).includes(status)) {
    throw new ApiError("Unknown form status.", { status: 400, code: "INVALID_STATUS" });
  }

  const form = findFormOrThrow(id);
  if (status === FORM_STATUS.PUBLISHED && form.questions.length === 0) {
    throw new ApiError("Add at least one question before publishing.", { status: 400, code: "NO_QUESTIONS" });
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