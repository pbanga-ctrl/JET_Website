"use client";

// Job application form shown on each /careers/[slug] page. Verifies a
// reCAPTCHA v3 token and posts multipart form data (including the résumé
// PDF) to /api/careers-apply, which forwards it to n8n — see that route and
// .env.example for the webhook URL it needs.
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusLine } from "@/components/ui/StatusLine";
import { RecaptchaScript } from "@/components/forms/RecaptchaScript";
import { useRecaptcha } from "@/hooks/useRecaptcha";

export function ApplyForm({ role }: { role: { slug: string; title: string } }) {
  const [applied, setApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useRecaptcha();

  if (applied) {
    return (
      <Card className="border-success">
        <StatusLine state="success">
          Received: we reply within five business days.
        </StatusLine>
      </Card>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const form = new FormData(e.currentTarget);
      form.set("roleSlug", role.slug);
      form.set("roleTitle", role.title);
      const captchaToken = await getToken("careers_apply");
      if (captchaToken) form.set("captchaToken", captchaToken);

      const res = await fetch("/api/careers-apply", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "send-failed");
      setApplied(true);
    } catch {
      setError("Something went wrong submitting that. Try again, or email your résumé directly.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <RecaptchaScript />
      <h3 className="text-[22px] font-bold">Send your application</h3>
      <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
        <Field label="Full name">
          <input type="text" name="name" required className={inputClass} />
        </Field>
        <Field label="Email">
          <input type="email" name="email" required className={inputClass} />
        </Field>
        <Field label="Résumé (PDF)">
          <input
            type="file"
            name="resume"
            accept="application/pdf"
            required
            className={inputClass}
          />
        </Field>
        <Field label="Anything else">
          <textarea
            name="notes"
            rows={3}
            placeholder="Machines you've commissioned, brands you know…"
            className={inputClass}
          />
        </Field>

        {error && <StatusLine state="error">{error}</StatusLine>}

        <Button
          type="submit"
          variant="signal"
          className="mt-2 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? "Submitting…" : "Submit application"}
        </Button>
        <p className="text-xs text-on-surface-muted">
          This site is protected by reCAPTCHA and the Google{" "}
          <a
            href="https://policies.google.com/privacy"
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            Privacy Policy
          </a>{" "}
          and{" "}
          <a
            href="https://policies.google.com/terms"
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            Terms of Service
          </a>{" "}
          apply.
        </p>
      </form>
    </Card>
  );
}

const inputClass =
  "w-full border border-border bg-surface-raised px-3 py-2 text-on-surface placeholder:text-on-surface-muted focus:border-2 focus:border-primary focus:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="label-caps text-on-surface-muted">{label}</span>
      {children}
    </label>
  );
}
