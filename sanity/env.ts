// Central place every other Sanity file reads its project config from.
// NEXT_PUBLIC_SANITY_PROJECT_ID isn't set yet (see .env.example) — until you
// create a project and add it, `configured` is false everywhere, and every
// CMS-backed page silently falls back to the static data in lib/data/*.ts,
// so the site keeps working exactly as it does today with zero setup.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2024-01-01";

export const configured = Boolean(projectId);
