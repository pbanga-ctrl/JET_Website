// Jet's own product line and proprietary OEM tech, shown on /products and
// (a curated subset) on the home page. Sourced from "Jet Products_Services
// List - Sheet1.pdf" — that sheet only had item names, no descriptions,
// specs or photos, so `body` below is draft marketing copy written from
// context to be reviewed/corrected. `code` is the short/brand name from
// that sheet's "Real Name" column (e.g. JETEX, X45C) where it differs
// meaningfully from the display title — worth keeping visible since
// customers may search for the code itself.
//
// `image`: a real product photo, in public/images/products/. Only a few
// products have one so far — everything else falls back to the
// technical-drawing PlaceholderImage in the product carousel (see
// components/products/ProductCarousel.tsx), which is deliberate: don't
// invent a photo for a product that doesn't have one yet.
export type Product = {
  slug: string;
  tag: string;
  title: string;
  code?: string;
  body: string;
  image?: { src: string; alt: string };
};

export const PRODUCTS: Product[] = [
  {
    slug: "palletizer",
    tag: "MATERIAL HANDLING",
    title: "Palletizer",
    body: "Robotic palletizing cells that stack cartons, bags or totes onto pallets at line speed, sized to the product mix and floor space you actually have.",
  },
  {
    slug: "box-erector",
    tag: "PACKAGING",
    title: "Box Erector",
    body: "Forms flat blanks into ready-to-fill cartons automatically, feeding straight into your packing line so cases stop being a bottleneck.",
  },
  {
    slug: "delta-assembly",
    tag: "ROBOTICS",
    title: "Delta Assembly",
    body: "Parallel-arm delta robots for high-speed pick-and-place and small-parts assembly, built for cycle times that keep up with the rest of the line.",
  },
  {
    slug: "bin-tipper",
    tag: "MATERIAL HANDLING",
    title: "Bin Tipper",
    body: "Safely tips totes and bulk bins into hoppers or conveyors, cutting the manual lifting out of feeding a process line.",
  },
  {
    slug: "battery-exchanger",
    tag: "FLEET SUPPORT",
    title: "Battery Exchanger",
    code: "JETEX",
    body: "Swaps depleted AGV and forklift batteries automatically, so fleet uptime doesn't depend on someone remembering to change one.",
  },
  {
    slug: "labeller",
    tag: "PACKAGING",
    title: "Labeller",
    body: "Applies labels inline at production speed, with the print-and-apply accuracy a packaging line's audit trail depends on.",
  },
  {
    slug: "computer-vision-systems",
    tag: "QUALITY",
    title: "Computer Vision Systems",
    code: "CVS",
    body: "Machine vision that catches defects, verifies presence and reads codes in real time, built into the line instead of bolted on after.",
  },
  {
    slug: "compressors",
    tag: "UTILITIES",
    title: "Compressors",
    body: "Sized and installed compressed-air packages for plant and process air, specified around actual demand rather than a generic catalog unit.",
  },
  {
    slug: "robot-cells",
    tag: "ROBOTICS",
    title: "Robot Cells",
    body: "Complete robotic work cells, robot, tooling, safety guarding and controls, proven in simulation before a single panel is built.",
  },
  {
    slug: "control-systems",
    tag: "CONTROLS",
    title: "Control Systems",
    body: "Control system packages built around your process, from I/O and PLC code through the HMI operators actually use.",
    image: { src: "/images/products/control-systems.jpg", alt: "JET-built control panel with safety relays, distributed I/O and terminal rails" },
  },
];

export const OEM_PRODUCTS: Product[] = [
  {
    slug: "oee",
    tag: "PERFORMANCE MONITORING",
    title: "OEE Monitor",
    code: "X45C",
    body: "Tracks Overall Equipment Effectiveness line-side in real time, turning downtime and cycle-time drift into numbers you can act on.",
    image: { src: "/images/products/oee.jpg", alt: "OEE monitor mounted line-side on a filling machine" },
  },
  {
    slug: "remote-io",
    tag: "CONTROL ARCHITECTURE",
    title: "Remote I/O",
    code: "RIO",
    body: "Distributed I/O modules that extend a control system's reach without home-running every wire back to a central panel.",
    image: { src: "/images/products/remote-io.jpg", alt: "JET Remote I/O enclosure mounted in a production plant" },
  },
  {
    slug: "jet-sense-ai",
    tag: "AI / PREDICTIVE",
    title: "Jet Sense AI",
    body: "An AI-driven watchdog that learns a line's normal operating pattern and flags the drift that precedes a breakdown, before it becomes downtime.",
    image: { src: "/images/products/jet-sense-ai.png", alt: "AI vision monitoring feed flagging safety and process violations" },
  },
  {
    slug: "dock-inspection",
    tag: "FACILITY SAFETY",
    title: "Dock Inspection",
    body: "Automated inspection of loading-dock equipment, catching wear and damage before it turns into a safety incident or a stuck trailer.",
  },
];
