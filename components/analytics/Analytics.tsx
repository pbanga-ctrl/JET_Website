"use client";

// Google tag (GT-…), loaded ONLY after the visitor accepts the "analytics"
// cookie category — see lib/cookie-consent.ts and CookieConsentBanner. The
// cookie policy tells visitors analytics only runs with permission, so the
// script must not be on the page before that: we render nothing at all until
// consent is recorded, rather than loading gtag and asking it to behave.
//
// Same tag ID the WordPress site used, so historical data stays continuous
// across the cutover. Set NEXT_PUBLIC_GOOGLE_TAG_ID to change or disable it
// (unset = no analytics anywhere, which is also how local dev runs).
import Script from "next/script";
import { useEffect, useState } from "react";
import { readStoredConsent } from "@/lib/cookie-consent";

const TAG_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_ID;

export function Analytics() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const sync = () => setAllowed(readStoredConsent()?.categories.analytics === true);
    sync();
    // Fires on every consent write, so accepting in the banner starts
    // analytics immediately instead of only on the next page load.
    window.addEventListener("jet-cookie-consent-changed", sync);
    return () => window.removeEventListener("jet-cookie-consent-changed", sync);
  }, []);

  if (!TAG_ID || !allowed) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${TAG_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${TAG_ID}');`}
      </Script>
    </>
  );
}
