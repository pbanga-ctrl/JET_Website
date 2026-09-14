// One-off import: pushes the built-in content in lib/data/*.ts into Sanity so
// the Studio starts with the real site content instead of an empty dataset.
//
//   node --experimental-strip-types scripts/seed-sanity.ts
//
// Safe to re-run: every document uses a deterministic _id and createOrReplace,
// so a second run overwrites rather than duplicating. Images are uploaded
// first and referenced by asset id — without that step the seeded documents
// would have no photos, and since CMS content takes precedence over the
// fallback, the live site would lose the photography it has today.
import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

import { SECTIONS } from "../lib/data/services.ts";
import { PRODUCTS, OEM_PRODUCTS } from "../lib/data/products.ts";
import { ROLES, OPEN_ROLE_SLUGS } from "../lib/data/roles.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("Need NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in the environment.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", token, useCdn: false });

// Upload each public/ image once, reuse the asset id everywhere it appears.
const assetCache = new Map<string, string>();
async function uploadImage(publicPath: string): Promise<string | null> {
  if (assetCache.has(publicPath)) return assetCache.get(publicPath)!;
  const file = join(root, "public", publicPath.replace(/^\//, ""));
  if (!existsSync(file)) {
    console.warn(`  ! missing image, skipping: ${publicPath}`);
    return null;
  }
  const asset = await client.assets.upload("image", readFileSync(file), { filename: basename(file) });
  assetCache.set(publicPath, asset._id);
  console.log(`  uploaded ${publicPath}`);
  return asset._id;
}

const imageRef = (id: string) => ({ _type: "image", asset: { _type: "reference", _ref: id } });

async function main() {
  const docs: Record<string, unknown>[] = [];

  console.log("Uploading images...");

  // --- services ----------------------------------------------------------
  for (const s of SECTIONS) {
    const assetId = s.photo ? await uploadImage(s.photo.src) : null;
    docs.push({
      _id: `service-${s.id}`,
      _type: "service",
      id: s.id,
      index: s.index,
      tag: s.tag,
      title: s.title,
      imageLabel: s.imageLabel,
      imageSize: s.imageSize,
      ...(assetId ? { photo: imageRef(assetId), photoAlt: s.photo!.alt } : {}),
      ...(s.chips ? { chips: s.chips } : {}),
      paragraphs: s.paragraphs,
      // Object array items need a stable _key or Sanity rejects them.
      ...(s.spec ? { spec: s.spec.map((r, i) => ({ _key: `spec${i}`, label: r.label, value: r.value })) } : {}),
    });
  }

  // --- products ----------------------------------------------------------
  const addProducts = async (list: typeof PRODUCTS, group: string, offset: number) => {
    for (const [i, p] of list.entries()) {
      const assetId = p.image ? await uploadImage(p.image.src) : null;
      docs.push({
        _id: `product-${p.slug}`,
        _type: "product",
        slug: p.slug,
        tag: p.tag,
        title: p.title,
        ...(p.code ? { code: p.code } : {}),
        body: p.body,
        ...(assetId ? { photo: imageRef(assetId), photoAlt: p.image!.alt } : {}),
        group,
        order: offset + i,
      });
    }
  };
  await addProducts(PRODUCTS, "Jet product", 0);
  await addProducts(OEM_PRODUCTS, "OEM tech", 100);

  // --- roles -------------------------------------------------------------
  const open = new Set<string>(OPEN_ROLE_SLUGS as readonly string[]);
  for (const r of Object.values(ROLES)) {
    docs.push({
      _id: `role-${r.slug}`,
      _type: "role",
      slug: r.slug,
      title: r.title,
      type: r.type,
      dept: r.dept,
      blurb: r.blurb,
      duties: r.duties,
      reqs: r.reqs,
      open: open.has(r.slug),
    });
  }

  console.log(`\nWriting ${docs.length} documents...`);
  let tx = client.transaction();
  for (const d of docs) tx = tx.createOrReplace(d as never);
  await tx.commit();

  const counts = docs.reduce<Record<string, number>>((acc, d) => {
    const t = String(d._type); acc[t] = (acc[t] || 0) + 1; return acc;
  }, {});
  console.log("Done:", JSON.stringify(counts), `| images uploaded: ${assetCache.size}`);
}

main().catch((e) => { console.error("FAILED:", e.message); process.exit(1); });
