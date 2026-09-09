"use client";

// GDPR/PIPEDA-style cookie banner, mounted once in app/layout.tsx so it can
// float above every page. Renders one of three views:
//   - "hidden"     consent already recorded in localStorage (see lib/cookie-consent.ts)
//   - "banner"     first visit — accept all / reject non-essential / customize
//   - "customize"  per-category toggles, opened either from the banner or
//                  later via ManageCookiesButton (any page can reopen this
//                  by dispatching OPEN_COOKIE_PREFERENCES_EVENT)
import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  CONSENT_CATEGORIES,
  OPEN_COOKIE_PREFERENCES_EVENT,
  readStoredConsent,
  writeStoredConsent,
  type ConsentState,
} from "@/lib/cookie-consent";

const ALL_ON: ConsentState = { functional: true, analytics: true, marketing: true };
const ALL_OFF: ConsentState = { functional: false, analytics: false, marketing: false };

type View = "hidden" | "banner" | "customize";

function subscribeToConsent(onChange: () => void) {
  window.addEventListener("jet-cookie-consent-changed", onChange);
  return () => window.removeEventListener("jet-cookie-consent-changed", onChange);
}

function getHasConsent() {
  return readStoredConsent() !== null;
}

// Assume "already decided" during SSR/first paint so the banner never
// flashes for returning visitors; useSyncExternalStore reconciles this
// against the real localStorage value right after mount.
function getHasConsentServer() {
  return true;
}

export function CookieConsentBanner() {
  const hasConsent = useSyncExternalStore(
    subscribeToConsent,
    getHasConsent,
    getHasConsentServer
  );
  const [reopened, setReopened] = useState<"banner" | "customize" | null>(null);
  const [draft, setDraft] = useState<ConsentState>(ALL_ON);

  useEffect(() => {
    function onOpenPreferences() {
      const current = readStoredConsent();
      setDraft(current?.categories ?? ALL_ON);
      setReopened("customize");
    }

    window.addEventListener(OPEN_COOKIE_PREFERENCES_EVENT, onOpenPreferences);
    return () =>
      window.removeEventListener(OPEN_COOKIE_PREFERENCES_EVENT, onOpenPreferences);
  }, []);

  // `reopened` (set by ManageCookiesButton or "Customize") always wins, even
  // if consent was already recorded — that's how a returning visitor gets
  // back into the preferences panel after the banner has stopped showing.
  const view: View = reopened ?? (hasConsent ? "hidden" : "banner");

  if (view === "hidden") return null;

  function acceptAll() {
    writeStoredConsent(ALL_ON);
    setReopened(null);
  }

  function rejectNonEssential() {
    writeStoredConsent(ALL_OFF);
    setReopened(null);
  }

  function savePreferences() {
    writeStoredConsent(draft);
    setReopened(null);
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-border-dark bg-secondary text-on-dark"
      role="region"
      aria-label="Cookie consent"
    >
      <div className="mx-auto max-h-[70dvh] max-w-[1264px] overflow-y-auto px-5 py-4 sm:px-8 sm:py-6">
        {view === "banner" && (
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <p className="max-w-2xl text-sm text-on-dark-muted">
              We use cookies to run this site and, with your permission, to
              understand how it’s used and support marketing follow-up. See
              our{" "}
              <Link
                href="/cookie-policy"
                className="text-on-dark underline hover:text-primary-bright"
              >
                Cookie Policy
              </Link>{" "}
              for details.
            </p>
            <div className="flex w-full flex-shrink-0 flex-wrap items-center gap-2 sm:w-auto sm:gap-3">
              <button
                type="button"
                onClick={() => setReopened("customize")}
                className="label-caps text-on-dark-muted underline-offset-4 hover:text-primary-bright hover:underline"
              >
                Customize
              </button>
              <Button variant="secondary-on-dark" onClick={rejectNonEssential}>
                Reject non-essential
              </Button>
              <Button variant="primary-on-dark" onClick={acceptAll}>
                Accept all
              </Button>
            </div>
          </div>
        )}

        {view === "customize" && (
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="label-caps text-on-dark-muted">Cookie preferences</p>
                <p className="mt-2 max-w-2xl text-sm text-on-dark-muted">
                  Choose which categories you’re comfortable with. You can
                  change this anytime from the link in the footer.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReopened(null)}
                aria-label="Back"
                className="label-caps text-on-dark-muted hover:text-primary-bright"
              >
                ← Back
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ConsentRow label="Necessary" description="Required for the site to function. Always active." locked />
              {CONSENT_CATEGORIES.map((c) => (
                <ConsentRow
                  key={c.id}
                  label={c.label}
                  description={c.description}
                  checked={draft[c.id]}
                  onChange={(checked) => setDraft((d) => ({ ...d, [c.id]: checked }))}
                />
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="secondary-on-dark" onClick={rejectNonEssential}>
                Reject non-essential
              </Button>
              <Button variant="primary-on-dark" onClick={savePreferences}>
                Save preferences
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ConsentRow({
  label,
  description,
  checked,
  onChange,
  locked = false,
}: {
  label: string;
  description: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  locked?: boolean;
}) {
  return (
    <div className="border border-border-dark bg-secondary-raised p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="label-caps">{label}</span>
        {locked ? (
          <span className="label-caps text-on-dark-muted">Always on</span>
        ) : (
          <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={`Toggle ${label} cookies`}
            onClick={() => onChange?.(!checked)}
            className={`relative h-5 w-9 flex-shrink-0 border transition-colors ${
              checked ? "border-primary-bright bg-primary-bright" : "border-border-dark bg-secondary"
            }`}
          >
            <span
              className={`absolute top-0.5 h-3.5 w-3.5 transition-transform ${
                checked ? "translate-x-[19px] bg-secondary" : "translate-x-0.5 bg-on-dark-muted"
              }`}
            />
          </button>
        )}
      </div>
      <p className="mt-2 text-xs text-on-dark-muted">{description}</p>
    </div>
  );
}
