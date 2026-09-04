import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";
import { projectId, dataset } from "./sanity/env";

// Powers the embedded Studio at /studio (app/studio/[[...tool]]/page.tsx).
// Until NEXT_PUBLIC_SANITY_PROJECT_ID is set (see .env.example), this falls
// back to a placeholder id — the Studio route still renders, it just can't
// actually connect to a project until a real one exists.
export default defineConfig({
  name: "jet-automation-cms",
  title: "JET Automation CMS",
  projectId: projectId || "placeholder-project-id",
  dataset,
  basePath: "/studio",
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
