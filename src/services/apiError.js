/**
 * One error type for the whole frontend.
 * The mock throws it now; the real fetch wrapper will throw it in Phase 5.
 * Components can check err.status / err.code without caring where the error came from.
 */
export class ApiError extends Error {
  constructor(message, { status = 500, code = "UNKNOWN_ERROR", fields } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status; // HTTP-style status: 400, 404, 409, 500…
    this.code = code; // machine-readable: "FORM_NOT_FOUND", "SLUG_TAKEN"…
    this.fields = fields; // optional per-field messages for forms: { slug: "Already taken" }
  }
}