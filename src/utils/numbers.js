/** "12" → 12, "" → null, "abc" → null. Used for optional number settings. */
export function toNumberOrNull(text) {
  const trimmed = String(text ?? "").trim();
  if (trimmed === "") return null;
  const number = Number(trimmed);
  return Number.isFinite(number) ? number : null;
}

/** range(3, 6) → [3, 4, 5, 6] */
export const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => start + i);