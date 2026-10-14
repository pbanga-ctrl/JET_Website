// Homepage credentials. `enabled` is the on/off switch for a mark that is
// still a draft: the SVG in `image` is original artwork, not Schneider
// Electric's trademark. Replace that file with the official Alliance
// Partner logo from Schneider's partner portal, then leave `enabled` true.
export const SCHNEIDER_ALLIANCE_BADGE = {
  enabled: true,
  image: "/badges/schneider-alliance-integrator.svg",
  alt: "Schneider Electric Alliance System Integrator",
  width: 300,
  height: 56,
} as const;
