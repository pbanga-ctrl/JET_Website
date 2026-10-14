// Homepage credentials. `enabled` hides a mark without deleting it.
// The SVG files are the companies' own artwork, unaltered: do not recolor,
// crop, or redraw them. Clear space is padding around each file.

// Schneider Electric's header wordmark, copied unchanged from the SVG
// embedded on https://www.se.com/ww/en/ (src-selogo-web, © 2024 Schneider
// Electric, SPDX LicenseRef-Proprietary). Fill stays #009530.
export const SCHNEIDER_ALLIANCE_BADGE = {
  enabled: true,
  image: "/badges/schneider-electric-logo.svg",
  alt: "Schneider Electric",
  width: 218,
  height: 64,
} as const;

// Omron wordmark from Wikimedia Commons, File:OMRON_Logo.svg
// (https://commons.wikimedia.org/wiki/File:OMRON_Logo.svg). The file is the
// blue OMRON mark, fill #166fc0, including the padding already in that SVG.
export const OMRON_CERTIFICATION_BADGE = {
  enabled: true,
  image: "/badges/omron-logo.svg",
  alt: "Omron",
  width: 815,
  height: 193,
} as const;

// Order is the rotation order under the hero headline.
export const CERTIFICATION_BADGES = [
  SCHNEIDER_ALLIANCE_BADGE,
  OMRON_CERTIFICATION_BADGE,
] as const;

// How long each badge stays up before the crossfade. Hover and focus pause it.
export const CERTIFICATION_ROTATE_MS = 4000;
