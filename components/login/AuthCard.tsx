"use client";

// Login/signup tabbed card for the customer portal page. UI-only prototype
// with intentionally fixed outcomes for demoing both states: sign-in
// always shows the credentials-not-recognised error, sign-up always shows
// the success message. There's no real authentication behind either.
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { StatusLine } from "@/components/ui/StatusLine";

const inputClass =
  "w-full border border-border-dark bg-secondary px-3 py-2 text-on-dark placeholder:text-on-dark-muted focus:border-2 focus:border-primary-bright focus:outline-none";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="label-caps text-on-dark-muted">{label}</span>
      {children}
    </label>
  );
}

export function AuthCard() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [loginError, setLoginError] = useState(false);
  const [signedUp, setSignedUp] = useState(false);

  return (
    <div className="border border-border-dark bg-secondary-raised p-8">
      <div className="flex border-b border-border-dark">
        {(["login", "signup"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`label-caps border-b-2 px-4 py-3 -mb-px transition-colors ${
              tab === t
                ? "border-primary-bright text-primary-bright"
                : "border-transparent text-on-dark-muted"
            }`}
          >
            {t === "login" ? "Log in" : "Sign up"}
          </button>
        ))}
      </div>

      {tab === "login" ? (
        <form
          className="mt-8 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setLoginError(true);
          }}
        >
          <Field label="Work email">
            <input type="email" required className={inputClass} />
          </Field>
          <Field label="Password">
            <input
              type="password"
              required
              placeholder="••••••••"
              className={inputClass}
            />
          </Field>
          <div className="flex items-center justify-between text-sm text-on-dark-muted">
            <label className="flex items-center gap-2">
              <span aria-hidden>☐</span> Remember me
            </label>
            <span className="cursor-pointer hover:text-primary-bright">
              Forgot password
            </span>
          </div>
          <Button type="submit" variant="primary-on-dark">
            Sign in
          </Button>
          {loginError && (
            <StatusLine state="error" dark>
              Credentials not recognised: check the email domain on file.
            </StatusLine>
          )}
        </form>
      ) : (
        <form
          className="mt-8 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSignedUp(true);
          }}
        >
          <Field label="Company">
            <input type="text" required className={inputClass} />
          </Field>
          <Field label="Full name">
            <input type="text" required className={inputClass} />
          </Field>
          <Field label="Work email">
            <input type="email" required className={inputClass} />
          </Field>
          <Field label="Password">
            <input
              type="password"
              required
              placeholder="Min. 10 characters"
              className={inputClass}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm text-on-dark-muted">
            <span aria-hidden>☐</span> I agree to the terms and privacy
            policy
          </label>
          <Button type="submit" variant="signal">
            Create account
          </Button>
          {signedUp && (
            <StatusLine state="success">
              Account requested: we verify company accounts within one
              business day.
            </StatusLine>
          )}
        </form>
      )}
    </div>
  );
}
