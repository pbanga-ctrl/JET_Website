// Handles the /contact-us form (ContactSection.tsx) — covers Quote, Service
// call, Parts and Other enquiries, since they're structurally one form that
// differ only by the `kind` chip the visitor picks. Verifies the reCAPTCHA
// v3 token server-side, then forwards the lead as JSON to the n8n webhook
// configured via N8N_CONTACT_WEBHOOK_URL (see .env.example) — build the
// downstream workflow (email/CRM/sheet) in n8n itself, this route only
// gets the lead there safely.
import { NextResponse } from "next/server";
import { verifyRecaptcha } from "@/lib/recaptcha";

export const runtime = "nodejs";

type ContactPayload = {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  kind?: string;
  message?: string;
  captchaToken?: string;
};

export async function POST(req: Request) {
  let body: ContactPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid-json" }, { status: 400 });
  }

  const { name, company, email, phone, kind, message, captchaToken } = body;
  if (!name?.trim() || !company?.trim() || !email?.trim() || !kind?.trim()) {
    return NextResponse.json({ ok: false, error: "missing-fields" }, { status: 400 });
  }

  const captcha = await verifyRecaptcha(captchaToken, "contact_submit");
  if (!captcha.ok) {
    return NextResponse.json({ ok: false, error: `captcha:${captcha.reason}` }, { status: 400 });
  }

  const webhookUrl = process.env.N8N_CONTACT_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("N8N_CONTACT_WEBHOOK_URL is not configured — dropping contact submission.");
    return NextResponse.json({ ok: false, error: "not-configured" }, { status: 500 });
  }

  try {
    const forwarded = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "jetautomation.ca/contact-us",
        submittedAt: new Date().toISOString(),
        name,
        company,
        email,
        phone: phone?.trim() || null,
        enquiryType: kind,
        message: message?.trim() || null,
        recaptchaScore: captcha.score ?? null,
      }),
    });
    if (!forwarded.ok) {
      console.error("n8n contact webhook returned", forwarded.status);
      return NextResponse.json({ ok: false, error: "webhook-failed" }, { status: 502 });
    }
  } catch (err) {
    console.error("n8n contact webhook unreachable", err);
    return NextResponse.json({ ok: false, error: "webhook-unreachable" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
