// Homepage credentials. `enabled` hides the lockup without deleting it.
//
// `image` is Schneider Electric's own header wordmark, copied unchanged
// from the SVG embedded on https://www.se.com/ww/en/ (the src-selogo-web
// asset, © 2024 Schneider Electric, SPDX LicenseRef-Proprietary). Do not
// recolor, crop, or redraw it. The viewBox already is the official art;
// clear space is padding around that file, not a tighter crop.
export const SCHNEIDER_ALLIANCE_BADGE = {
  enabled: true,
  image: "/badges/schneider-electric-logo.svg",
  alt: "Schneider Electric",
  width: 218,
  height: 64,
} as const;
