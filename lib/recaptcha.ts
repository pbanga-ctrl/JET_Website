// Server-side verification for Google reCAPTCHA v3 tokens submitted by the
// contact/quote form and the job-application form. Each form's client code
// fetches an action-scoped token (see hooks/useRecaptcha.ts) and sends it
// along with the rest of the payload; the API route that receives it calls
// verifyRecaptcha() before doing anything else with the submission.
//
// RECAPTCHA_SECRET_KEY comes from the same reCAPTCHA v3 site registration as
// NEXT_PUBLIC_RECAPTCHA_SITE_KEY (see .env.example) — get both from
// https://www.google.com/recaptcha/admin/create.
export type RecaptchaVerifyResult = {
  ok: boolean;
  score?: number;
  reason?: string;
};

export async function verifyRecaptcha(
  token: string | undefined,
  expectedAction: string
): Promise<RecaptchaVerifyResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    // No key configured — this only happens in local dev before the env var
    // is set. Let submissions through instead of hard-failing every form in
    // dev, but shout about it so it can't accidentally ship this way.
    console.warn(
      "RECAPTCHA_SECRET_KEY is not set — skipping captcha verification. " +
        "This must be configured before deploying."
    );
    return { ok: true };
  }
  if (!token) {
    return { ok: false, reason: "missing-token" };
  }

  let data: {
    success: boolean;
    score?: number;
    action?: string;
    "error-codes"?: string[];
  };
  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });
    data = await res.json();
  } catch (err) {
    console.error("reCAPTCHA verify request failed", err);
    return { ok: false, reason: "verify-request-failed" };
  }

  if (!data.success) {
    return { ok: false, reason: (data["error-codes"] || []).join(",") || "verify-failed" };
  }
  if (data.action !== expectedAction) {
    return { ok: false, reason: `action-mismatch:${data.action}` };
  }
  // v3 has no challenge UI — it just scores how bot-like the request looked,
  // 0.0 (bot) to 1.0 (human). 0.5 is Google's own suggested cutoff.
  if (typeof data.score === "number" && data.score < 0.5) {
    return { ok: false, score: data.score, reason: "low-score" };
  }
  return { ok: true, score: data.score };
}
