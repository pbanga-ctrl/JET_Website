// Handles job applications submitted from ApplyForm.tsx (on every
// /careers/[slug] page). Unlike /api/contact this is multipart (the résumé
// PDF), so it reads a FormData body instead of JSON and re-forwards a fresh
// FormData (including the file) to the n8n webhook configured via
// N8N_CAREERS_WEBHOOK_URL (see .env.example) — build the downstream workflow
// (store the résumé, notify HR, etc.) in n8n itself.
import { NextResponse } from "next/server";
import { verifyRecaptcha } from "@/lib/recaptcha";

export const runtime = "nodejs";

const MAX_RESUME_BYTES = 8 * 1024 * 1024; // 8 MB

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid-form-data" }, { status: 400 });
  }

  const name = form.get("name");
  const email = form.get("email");
  const roleSlug = form.get("roleSlug");
  const roleTitle = form.get("roleTitle");
  const notes = form.get("notes");
  const captchaToken = form.get("captchaToken");
  const resume = form.get("resume");

  if (
    typeof name !== "string" || !name.trim() ||
    typeof email !== "string" || !email.trim() ||
    typeof roleSlug !== "string" || !roleSlug.trim() ||
    !(resume instanceof File) || resume.size === 0
  ) {
    return NextResponse.json({ ok: false, error: "missing-fields" }, { status: 400 });
  }
  if (resume.type !== "application/pdf") {
    return NextResponse.json({ ok: false, error: "resume-must-be-pdf" }, { status: 400 });
  }
  if (resume.size > MAX_RESUME_BYTES) {
    return NextResponse.json({ ok: false, error: "resume-too-large" }, { status: 400 });
  }

  const captcha = await verifyRecaptcha(
    typeof captchaToken === "string" ? captchaToken : undefined,
    "careers_apply"
  );
  if (!captcha.ok) {
    return NextResponse.json({ ok: false, error: `captcha:${captcha.reason}` }, { status: 400 });
  }

  const webhookUrl = process.env.N8N_CAREERS_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("N8N_CAREERS_WEBHOOK_URL is not configured — dropping application.");
    return NextResponse.json({ ok: false, error: "not-configured" }, { status: 500 });
  }

  const outgoing = new FormData();
  outgoing.set("source", "jetautomation.ca/careers");
  outgoing.set("submittedAt", new Date().toISOString());
  outgoing.set("name", name);
  outgoing.set("email", email);
  outgoing.set("roleSlug", roleSlug);
  outgoing.set("roleTitle", typeof roleTitle === "string" && roleTitle ? roleTitle : roleSlug);
  outgoing.set("notes", typeof notes === "string" ? notes : "");
  outgoing.set("recaptchaScore", String(captcha.score ?? ""));
  outgoing.set("resume", resume, resume.name);

  try {
    const forwarded = await fetch(webhookUrl, { method: "POST", body: outgoing });
    if (!forwarded.ok) {
      console.error("n8n careers webhook returned", forwarded.status);
      return NextResponse.json({ ok: false, error: "webhook-failed" }, { status: 502 });
    }
  } catch (err) {
    console.error("n8n careers webhook unreachable", err);
    return NextResponse.json({ ok: false, error: "webhook-unreachable" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
