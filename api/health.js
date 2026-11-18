/**
 * GET /api/health
 * Confirms that Vercel Serverless Functions are deployed and reachable.
 * Vercel maps every file in /api to a route automatically: api/health.js → /api/health
 */
export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({
      error: { code: "METHOD_NOT_ALLOWED", message: "Method not allowed" },
    });
  }

  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({
    status: "ok",
    service: "reelo-forms",
    timestamp: new Date().toISOString(),
  });
}