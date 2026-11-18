/**
 * Slug rules shared by the frontend and the backend.
 * A slug is the public part of a form URL: /f/<slug>
 */
export const SLUG_MIN_LENGTH = 3;
export const SLUG_MAX_LENGTH = 60;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/; // e.g. "restaurant-trends-2027"

/** "Restaurant Trends 2027!" → "restaurant-trends-2027" */
export function slugify(text) {
  return String(text ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents: "café" → "cafe"
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // remove anything that isn't a letter, number, space or hyphen
    .replace(/[\s_-]+/g, "-") // spaces/underscores/repeated hyphens → single hyphen
    .replace(/^-+|-+$/g, "") // no leading/trailing hyphens
    .slice(0, SLUG_MAX_LENGTH)
    .replace(/-+$/g, "");
}

export function isValidSlug(slug) {
  return (
    typeof slug === "string" &&
    slug.length >= SLUG_MIN_LENGTH &&
    slug.length <= SLUG_MAX_LENGTH &&
    SLUG_PATTERN.test(slug)
  );
}

/**
 * Builds a slug from `text` that isn't already in `takenSlugs`.
 * "untitled-form" is taken → "untitled-form-2" → "untitled-form-3" …
 */
export function makeUniqueSlug(text, takenSlugs = []) {
  const taken = new Set(takenSlugs);
  const slug = slugify(text);
  const root = slug.length >= SLUG_MIN_LENGTH ? slug : "form";

  if (!taken.has(root)) return root;

  let n = 2;
  while (true) {
    const suffix = `-${n}`;
    const candidate = root.slice(0, SLUG_MAX_LENGTH - suffix.length).replace(/-+$/g, "") + suffix;
    if (!taken.has(candidate)) return candidate;
    n += 1;
  }
}

