"use client";

// The contact/quote form + info card on /contact-us. "Quote", "Service
// call", "Parts" and "Other" all post here — enquiryType tells n8n and
// whatever's downstream which kind of lead it is, instead of splitting into
// separate forms for what's structurally one submission. Verifies a
// reCAPTCHA v3 token and forwards to n8n via /api/contact (see that route
// and .env.example for the webhook URL it needs).
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusLine } from "@/components/ui/StatusLine";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { RecaptchaScript } from "@/components/forms/RecaptchaScript";
import { useRecaptcha } from "@/hooks/useRecaptcha";

const KINDS = ["Quote", "Service call", "Parts", "Other"] as const;
const STEPS = ["Your project", "Details", "Confirm"] as const;

const inputClass =
  "w-full border border-border bg-surface-raised px-3 py-2 text-on-surface placeholder:text-on-surface-muted focus:border-2 focus:border-primary focus:outline-none";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="label-caps text-on-surface-muted">{label}</span>
      {children}
    </label>
  );
}

// Purely decorative progress bar — there's no real multi-step form here
// (the actual form is one step), it just highlights "step 1" before submit
// and jumps straight to "step 3 / confirm" after, skipping the middle step.
function StepIndicator({ sent }: { sent: boolean }) {
  return (
    <div className="grid grid-cols-3 border border-border">
      {STEPS.map((label, i) => {
        const isFirst = i === 0;
        const isLast = i === STEPS.length - 1;
        const filled = (isFirst && !sent) || (isLast && sent);
        return (
          <div
            key={label}
            className={`label-caps border-r border-border px-4 py-3 text-center last:border-r-0 ${
              filled ? "bg-tertiary text-on-surface" : "text-on-surface-muted"
            }`}
          >
            {String(i + 1).padStart(2, "0")} · {label}
          </div>
        );
      })}
    </div>
  );
}

const initialFields = { name: "", company: "", email: "", phone: "", message: "" };

export function ContactSection() {
  const [sent, setSent] = useState(false);
  const [kind, setKind] = useState<(typeof KINDS)[number]>("Quote");
  const [fields, setFields] = useState(initialFields);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState("");
  const { getToken } = useRecaptcha();

  const setField =
    (key: keyof typeof initialFields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFields((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const captchaToken = await getToken("contact_submit");
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, kind, captchaToken }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "send-failed");
      setReference(String(Date.now()).slice(-6));
      setSent(true);
    } catch {
      setError("Something went wrong sending that. Try again, or call us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <RecaptchaScript />
      <StepIndicator sent={sent} />

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          {sent ? (
            <Card className="border-2 border-success">
              <StatusLine state="success">Request sent</StatusLine>
              <h2 className="mt-3 text-[30px] font-bold leading-[1.2]">
                Thanks, reference JA-{reference}
              </h2>
              <p className="mt-3 text-on-surface-muted">
                An engineer reviews every request. Expect a reply within one
                business day; urgent breakdowns should call the engineering
                line directly.
              </p>
            </Card>
          ) : (
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Name">
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    className={inputClass}
                    value={fields.name}
                    onChange={setField("name")}
                  />
                </Field>
                <Field label="Company">
                  <input
                    type="text"
                    required
                    placeholder="Acme Manufacturing"
                    className={inputClass}
                    value={fields.company}
                    onChange={setField("company")}
                  />
                </Field>
                <Field label="Work email">
                  <input
                    type="email"
                    required
                    placeholder="jane@acme.com"
                    className={inputClass}
                    value={fields.email}
                    onChange={setField("email")}
                  />
                </Field>
                <Field label="Phone">
                  <input
                    type="tel"
                    placeholder="905 000 0000"
                    className={inputClass}
                    value={fields.phone}
                    onChange={setField("phone")}
                  />
                </Field>
              </div>

              <div>
                <span className="label-caps text-on-surface-muted">
                  Enquiry type
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {KINDS.map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setKind(k)}
                      className={`label-caps border px-4 py-2 transition-colors ${
                        kind === k
                          ? "border-primary bg-primary text-surface"
                          : "border-border text-on-surface-muted hover:border-primary hover:text-primary"
                      }`}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              <Field label="Tell us about the application">
                <textarea
                  rows={4}
                  placeholder="Process, cycle-time target, existing controls, timeline…"
                  className={inputClass}
                  value={fields.message}
                  onChange={setField("message")}
                />
              </Field>
              <p className="text-sm text-on-surface-muted">
                Drawings or specs? Attach after the first reply: we’ll send
                a secure link.
              </p>

              {error && <StatusLine state="error">{error}</StatusLine>}

              <Button
                type="submit"
                variant="signal"
                className="self-start disabled:cursor-not-allowed disabled:opacity-60"
                disabled={submitting}
              >
                {submitting ? "Sending…" : "Send request"}
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
          )}
        </div>

        <div className="lg:col-span-5">
          <Card>
            <dl className="flex flex-col gap-4">
              <InfoRow label="Office line" value="1-877-904-8724" />
              <InfoRow label="Engineering line" value="1-877-904-8724 ext. 4" />
              <InfoRow label="Hours" value="Mon–Fri 9:00–17:00 ET" />
              <InfoRow
                label="Address"
                value="7676 Kimbel St, Units 8–13, Mississauga, ON L5S 1J8"
              />
              <InfoRow
                label="Email"
                value={
                  <a
                    href="mailto:info@jetautomation.ca"
                    className="text-primary hover:underline"
                  >
                    info@jetautomation.ca
                  </a>
                }
              />
            </dl>
          </Card>
          <MapEmbed
            query="7676 Kimbel St, Units 8-13, Mississauga, ON L5S 1J8"
            label="Map: JET Automation, 7676 Kimbel St, Mississauga, ON"
            className="mt-6 h-[280px]"
          />
        </div>
      </div>
    </>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <dt className="label-caps text-on-surface-muted">{label}</dt>
      <dd className="spec-mono mt-1">{value}</dd>
    </div>
  );
}
