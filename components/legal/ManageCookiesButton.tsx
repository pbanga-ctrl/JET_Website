"use client";

// Reopens the cookie preferences panel from anywhere (used on the cookie
// policy page). Just dispatches a window event — CookieConsentBanner is
// the one actually listening and rendering the "customize" view.
import { Button } from "@/components/ui/Button";
import { openCookiePreferences } from "@/lib/cookie-consent";

export function ManageCookiesButton() {
  return (
    <Button variant="secondary" onClick={openCookiePreferences}>
      Manage cookie preferences
    </Button>
  );
}
