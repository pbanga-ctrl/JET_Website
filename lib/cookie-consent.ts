// Cookie-consent storage + cross-component signaling, backing
// CookieConsentBanner. There's no cookie-consent library here — consent is
// just a versioned JSON blob in localStorage, and the two custom
// `window` events below are how other components react to it:
//   - "jet-cookie-consent-changed"     fired after every write, so the
//     banner (via useSyncExternalStore) knows to hide itself immediately
//   - "jet-open-cookie-preferences"    fired by openCookiePreferences() to
//     ask the banner to reopen its "customize" view from elsewhere on the site
export type ConsentCategory = "functional" | "analytics" | "marketing";

export type ConsentState = Record<ConsentCategory, boolean>;

export type StoredConsent = {
  version: 1;
  decidedAt: string;
  categories: ConsentState;
};

export const CONSENT_STORAGE_KEY = "jet-cookie-consent";

export const CONSENT_CATEGORIES: {
  id: ConsentCategory;
  label: string;
  description: string;
}[] = [
  {
    id: "functional",
    label: "Functional",
    description:
      "Remembers preferences like form inputs and session state so the site works the way you left it.",
  },
  {
    id: "analytics",
    label: "Analytics",
    description:
      "Usage insights (e.g. Google Analytics) that help us understand which pages are useful and where visitors get stuck.",
  },
  {
    id: "marketing",
    label: "Marketing",
    description:
      "Used by services like HubSpot to measure campaigns and tailor follow-up communication.",
  },
];

export function readStoredConsent(): StoredConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    // Bumping CONSENT categories/shape in the future? Bump this version
    // number too — any stored value from an older version is treated as
    // "no consent recorded", re-showing the banner instead of trusting stale data.
    if (parsed.version !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeStoredConsent(categories: ConsentState) {
  if (typeof window === "undefined") return;
  const value: StoredConsent = {
    version: 1,
    decidedAt: new Date().toISOString(),
    categories,
  };
  window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("jet-cookie-consent-changed", { detail: value }));
}

export const OPEN_COOKIE_PREFERENCES_EVENT = "jet-open-cookie-preferences";

export function openCookiePreferences() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_COOKIE_PREFERENCES_EVENT));
}
