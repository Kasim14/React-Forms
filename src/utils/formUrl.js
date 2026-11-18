/** Full public link for a form, e.g. https://reelo-forms.vercel.app/f/restaurant-trends-2027 */
export function getPublicFormUrl(slug) {
  return `${window.location.origin}/f/${slug}`;
}