// Static content for the six services shown on /services (both the sticky
// sub-nav in app/services/page.tsx and the scrollytelling text/image layout
// in components/services/ServiceScroller.tsx render off this same array —
// ids s01..s06 must match the sub-nav's anchor hrefs). Kept in a plain
// (non-"use client") module so the server-rendered page and the client
// component can both import it directly — a "use client" file's non-component
// exports aren't safe to import into a Server Component.
//
// `photo`: real photography for the section, in public/images/services/,
// rendered with a soft tiled-fade edge mask (see ServiceScroller.tsx) so it
// blends into the page instead of sitting in a hard-edged box. Sections
// without a `photo` (currently just Robotics — no photo was supplied for it
// yet) fall back to the PlaceholderImage using `imageLabel`/`imageSize` below.
//
// This shape is also what lib/cms/services.ts fetches from Sanity into —
// SECTIONS below is the fallback used until (and unless) a "service"
// document exists in the CMS, so the two must stay structurally compatible.
export type Section = {
  id: string;
  index: string;
  tag: string;
  title: string;
  imageLabel: string;
  imageSize: string;
  photo?: { src: string; alt: string };
  chips?: string[];
  paragraphs: string[];
  spec?: { label: string; value: string }[];
};

export const SECTIONS: Section[] = [
  {
    id: "s01",
    index: "01",
    tag: "INDUSTRIAL AUTOMATION",
    title: "Industrial Automation",
    imageLabel: "automated line photo",
    imageSize: "800 × 600",
    photo: { src: "/images/services/industrial-automation.jpg", alt: "Industrial automation line" },
    paragraphs: [
      "Manufacturing had to become more efficient, cost effective and safer without giving up quality. Industrial automation is our core competency: we meet a customer's challenge head on and build the solution that achieves the outcome.",
      "As the factory floor and the office floor merge, the pace of change is faster than anything manufacturers have absorbed before. We plan systems that survive the next upgrade, not just this one.",
    ],
  },
  {
    id: "s02",
    index: "02",
    tag: "ELECTRICAL DESIGN",
    title: "Electrical Design",
    imageLabel: "panel shop photo",
    imageSize: "800 × 600",
    photo: { src: "/images/services/panel-open.jpg", alt: "Open electrical control panel" },
    chips: ["AutoCAD", "AutoCAD Electrical", "EPLAN", "UL / CSA"],
    paragraphs: [
      "Custom electrical controls designed for immediate needs and the demands that arrive later. Schematics in AutoCAD, AutoCAD Electrical or EPLAN to suit your standards, with third-party inspection where compliance requires it.",
      "Our electrical team has direct access to the in-house panel shop, so builders' hands-on experience feeds back into the layout before it's cut.",
    ],
  },
  {
    id: "s03",
    index: "03",
    tag: "MECHANICAL DESIGN",
    title: "Mechanical Design",
    imageLabel: "machine assembly photo",
    imageSize: "800 × 600",
    photo: { src: "/images/services/mechanical-design.jpg", alt: "Mechanical design and machine assembly" },
    paragraphs: [
      "Mechanical and mechatronics designers on staff to take on design challenges that complement any custom machine build or robotics project.",
      "That extends to pneumatic, vacuum and conveyor systems, including the control design those systems need to run as one machine.",
    ],
  },
  {
    id: "s04",
    index: "04",
    tag: "CONTROL SYSTEMS",
    title: "Control Systems",
    imageLabel: "HMI / control cabinet photo",
    imageSize: "800 × 600",
    photo: { src: "/images/services/hmi.jpg", alt: "HMI control cabinet" },
    paragraphs: [
      "Controls specialists with deep experience in hydraulic, pneumatic, temperature and pressure control. We design and develop the hardware and the software that gives your application the precision it needs.",
    ],
    spec: [
      { label: "Hydraulic 4- and 6-post AGV lift, precise positioning", value: "100,000 lb" },
      { label: "Blow / injection molding heater & parison control", value: "± 1 °C" },
      { label: "Rod-less cylinder proportional positioning", value: "± 0.5 mm" },
    ],
  },
  {
    id: "s05",
    index: "05",
    tag: "ROBOTICS",
    title: "Robotics",
    imageLabel: "robot cell photo",
    imageSize: "800 × 600",
    paragraphs: [
      "Robotics made manufacturing repeatable and versatile enough to switch products on the same line. We integrate everything from standalone pick-and-place to complete robotic cells.",
      "High-speed SCARA, parallel delta, six-axis, and collaborative robots working alongside your operators on the dangerous or repetitive work. We guide the selection with 3D walkthroughs, layouts and proof-of-concept simulation so you can see the cell before it exists.",
    ],
  },
  {
    id: "s06",
    index: "06",
    tag: "INDUSTRIAL SAFETY",
    title: "Industrial Safety",
    imageLabel: "light curtain / guarding photo",
    imageSize: "800 × 600",
    photo: { src: "/images/services/safety.jpg", alt: "Safety interlock switch on a guarded cell" },
    paragraphs: [
      "Safety has moved from afterthought to first consideration. Single-channel E-stop chains have given way to safety-rated scanners, light curtains and devices that sense intrusion before exposure.",
      "Modern safety relays and safety PLCs offer remote safety-rated I/O, faster and more cost effective than hardwiring every device, and able to sit alongside existing PLCs and HMIs to keep diagnostics and downtime under control. Safety in the workplace is not optional.",
    ],
  },
];
