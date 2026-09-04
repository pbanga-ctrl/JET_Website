"use client";

// Loads the Google reCAPTCHA v3 script for whichever page mounts it. Mount
// once per page that has a form calling useRecaptcha() — next/script dedupes
// by src, so there's no harm if a shared layout ever renders it twice.
import Script from "next/script";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export function RecaptchaScript() {
  if (!SITE_KEY) return null;
  return (
    <Script
      src={`https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`}
      strategy="afterInteractive"
    />
  );
}
