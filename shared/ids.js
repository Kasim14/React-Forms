/** Short unique ids like "q_3f9a1c0b2e". Works in browsers and Node 19+. */
export function createId(prefix) {
  return `${prefix}_${crypto.randomUUID().replaceAll("-", "").slice(0, 10)}`;
}