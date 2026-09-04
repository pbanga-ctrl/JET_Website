// Static job posting content, keyed by slug (used for the /careers/[slug]
// route). To add a posting: add a ROLES entry, then add its key to
// OPEN_ROLE_SLUGS to list it on /careers — a slug can exist in ROLES
// without being in OPEN_ROLE_SLUGS (e.g. "general") to stay linkable
// without appearing in the open-roles list.
export type Role = {
  slug: string;
  title: string;
  type: string;
  dept: string;
  blurb: string;
  duties: string[];
  reqs: string[];
};

export const ROLES: Record<string, Role> = {
  controls: {
    slug: "controls",
    title: "Controls Engineer",
    type: "Full-time",
    dept: "Engineering",
    blurb:
      "You will own controls design and commissioning on custom machines and robotic cells: from I/O lists and schematics through PLC code, HMI and on-site debug with the customer standing beside you.",
    duties: [
      "Develop PLC and HMI code (Allen-Bradley, Siemens, Beckhoff)",
      "Produce I/O lists, panel layouts and schematics with the electrical team",
      "Commission equipment on customer sites across Ontario",
      "Support the panel shop through build and factory acceptance testing",
    ],
    reqs: [
      "Degree or diploma in controls, electrical or mechatronics engineering",
      "3+ years machine-controls experience in a manufacturing environment",
      "Comfortable troubleshooting live equipment safely",
      "Valid driver’s licence and passport for occasional travel",
    ],
  },
  panel: {
    slug: "panel",
    title: "Panel Builder",
    type: "Full-time",
    dept: "Skilled trades",
    blurb:
      "Build the control panels our engineers design, cleanly, to print, and on schedule, in a shop that sits down the hall from the people who drew them.",
    duties: [
      "Assemble and wire control panels to schematic",
      "Cut, drill and lay out enclosures and backplates",
      "Perform point-to-point checks and power-up testing",
      "Feed layout improvements back to engineering",
    ],
    reqs: [
      "Electrical assembly or industrial wiring experience",
      "Able to read electrical schematics and panel layouts",
      "UL 508A familiarity an asset",
      "Attention to labelling and cable management",
    ],
  },
  mech: {
    slug: "mech",
    title: "Mechanical Designer",
    type: "Contract",
    dept: "Design",
    blurb:
      "Design the machine around the process: tooling, guarding, conveyors and pneumatics that complement our robotics and controls work.",
    duties: [
      "3D model machine assemblies and produce fabrication drawings",
      "Specify pneumatics, actuators, bearings and drives",
      "Design guarding that satisfies the safety assessment",
      "Support build and debug on the shop floor",
    ],
    reqs: [
      "Mechanical or mechatronics diploma/degree",
      "Proficiency in SolidWorks or Inventor",
      "Experience with automation tooling or conveyors",
      "Available for a 12-month contract, on-site",
    ],
  },
  general: {
    slug: "general",
    title: "General Application",
    type: "Open",
    dept: "Any",
    blurb:
      "No posting fits, but you build, wire, code or design automation for a living. Tell us what you do best and what you want to be doing in two years.",
    duties: [
      "Tell us the machines or systems you have worked on",
      "Name the platforms and tools you know well",
      "Say what kind of work you want more of",
    ],
    reqs: [
      "Legally able to work in Canada",
      "Willing to be on a plant floor",
    ],
  },
};

export const OPEN_ROLE_SLUGS = ["controls", "panel", "mech"] as const;
