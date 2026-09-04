"use client";

// Client-side half of Google reCAPTCHA v3: fetches an action-scoped token
// right before a form submits. v3 has no challenge UI, so this stays
// invisible — pair with <RecaptchaScript /> (mounted once per page that has
// a form) to actually load the grecaptcha script this depends on.
import { useCallback } from "react";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

function waitForGrecaptcha(): Promise<void> {
  return new Promise((resolve) => {
    const check = () => {
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => resolve());
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  });
}

export function useRecaptcha() {
  const getToken = useCallback(async (action: string): Promise<string | undefined> => {
    if (!SITE_KEY) {
      // Not configured yet (e.g. local dev before the key is added) — let
      // the form submit without a token; the API route treats a missing
      // RECAPTCHA_SECRET_KEY the same way, so this only matters once one
      // side is configured and the other isn't.
      console.warn(
        "NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set — submitting without a captcha token."
      );
      return undefined;
    }
    await waitForGrecaptcha();
    return window.grecaptcha!.execute(SITE_KEY, { action });
  }, []);

  return { getToken, configured: Boolean(SITE_KEY) };
}
