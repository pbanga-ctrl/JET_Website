import { sanityClient, configured } from "./client";
import { ROLES as STATIC_ROLES, OPEN_ROLE_SLUGS as STATIC_OPEN_SLUGS, type Role } from "@/lib/data/roles";

const QUERY = `*[_type == "role"] {
  slug, title, type, dept, blurb, duties, reqs, open
}`;

type RoleDoc = {
  slug: string;
  title: string;
  type: string;
  dept: string;
  blurb: string;
  duties?: string[];
  reqs?: string[];
  open?: boolean;
};

// Returns the same two shapes lib/data/roles.ts exports (a slug-keyed
// record + the list of slugs to show on /careers) so both consumers
// (app/careers/page.tsx and app/careers/[slug]/page.tsx) can swap the
// static import for this with no other changes.
export async function getRoles(): Promise<{ roles: Record<string, Role>; openSlugs: string[] }> {
  if (!configured || !sanityClient) {
    return { roles: STATIC_ROLES, openSlugs: [...STATIC_OPEN_SLUGS] };
  }

  try {
    const docs = await sanityClient.fetch<RoleDoc[]>(
      QUERY,
      {},
      { next: { revalidate: 60, tags: ["role"] } }
    );
    if (!docs || docs.length === 0) {
      return { roles: STATIC_ROLES, openSlugs: [...STATIC_OPEN_SLUGS] };
    }

    const roles: Record<string, Role> = {};
    const openSlugs: string[] = [];
    for (const doc of docs) {
      roles[doc.slug] = {
        slug: doc.slug,
        title: doc.title,
        type: doc.type,
        dept: doc.dept,
        blurb: doc.blurb,
        duties: doc.duties ?? [],
        reqs: doc.reqs ?? [],
      };
      if (doc.open !== false) openSlugs.push(doc.slug);
    }
    return { roles, openSlugs };
  } catch (err) {
    console.error("Sanity fetch failed for roles — falling back to static data", err);
    return { roles: STATIC_ROLES, openSlugs: [...STATIC_OPEN_SLUGS] };
  }
}
