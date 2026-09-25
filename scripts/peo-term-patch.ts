// One-off remediation for the PEO notice (Professional Engineers Act,
// s.12(2) / s.40). Rewrites the regulated wording in the Sanity documents
// that are actually serving the live site — the source files in lib/data are
// only the fallback, so fixing those alone would leave the wording public.
//
//   node --experimental-strip-types scripts/peo-term-patch.ts [--dry]
//
// Surgical on purpose: it walks every string field, applies the phrase map,
// and patches only documents that actually change — so images, ordering and
// anything edited in the Studio are left alone. Re-running is a no-op.
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
const dry = process.argv.includes("--dry");

if (!projectId || !token) {
  console.error("Need NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", token, useCdn: false });

// Order matters: longer, more specific phrases first.
const PHRASES: [string, string][] = [
  ["Degree or diploma in controls, electrical or mechatronics engineering",
   "Technical diploma or degree in controls, electrical or mechatronics"],
  ["Build the control panels our engineers design",
   "Build the control panels our design team draws"],
  ["Feed layout improvements back to engineering",
   "Feed layout improvements back to the design team"],
  ["Mechanical and mechatronics engineers on staff",
   "Mechanical and mechatronics designers on staff"],
  ["Controls engineers with deep experience",
   "Controls specialists with deep experience"],
  ["engineer the solution", "build the solution"],
  ["Controls Engineer", "Controls Specialist"],
];

// `dept: "Engineering"` is an exact-value field, handled separately so the
// bare word is never substring-replaced inside other copy.
const EXACT: Record<string, string> = { Engineering: "Controls" };

function rewrite(value: unknown, key?: string): unknown {
  if (typeof value === "string") {
    if (key === "dept" && EXACT[value]) return EXACT[value];
    let out = value;
    for (const [from, to] of PHRASES) out = out.split(from).join(to);
    return out;
  }
  if (Array.isArray(value)) return value.map((v) => rewrite(v));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, rewrite(v, k)])
    );
  }
  return value;
}

async function main() {
  const docs = await client.fetch<Record<string, unknown>[]>(
    `*[_type in ["service","product","role"]]`
  );
  console.log(`Scanned ${docs.length} documents.`);

  let patched = 0;
  for (const doc of docs) {
    const id = String(doc._id);
    const fields = Object.fromEntries(
      Object.entries(doc).filter(([k]) => !k.startsWith("_"))
    );
    const next = rewrite(fields) as Record<string, unknown>;
    const changed = Object.keys(next).filter(
      (k) => JSON.stringify(next[k]) !== JSON.stringify(fields[k])
    );
    if (changed.length === 0) continue;

    patched++;
    console.log(`  ${id}: ${changed.join(", ")}`);
    for (const k of changed) {
      const before = JSON.stringify(fields[k]);
      const after = JSON.stringify(next[k]);
      if (before.length < 160) console.log(`      ${before}\n   -> ${after}`);
    }
    if (!dry) {
      await client.patch(id).set(Object.fromEntries(changed.map((k) => [k, next[k]]))).commit();
    }
  }

  // Prove nothing regulated survives.
  const after = await client.fetch<Record<string, unknown>[]>(
    `*[_type in ["service","product","role"]]`
  );
  const leftovers: string[] = [];
  const scan = (v: unknown, path: string) => {
    if (typeof v === "string") { if (/engineer/i.test(v)) leftovers.push(`${path}: ${v.slice(0, 70)}`); }
    else if (Array.isArray(v)) v.forEach((x, i) => scan(x, `${path}[${i}]`));
    else if (v && typeof v === "object") Object.entries(v).forEach(([k, x]) => scan(x, `${path}.${k}`));
  };
  after.forEach((d) => scan(Object.fromEntries(Object.entries(d).filter(([k]) => !k.startsWith("_"))), String(d._id)));

  console.log(`\n${dry ? "[dry run] would patch" : "Patched"} ${patched} document(s).`);
  console.log(leftovers.length
    ? "REMAINING in Sanity:\n  " + leftovers.join("\n  ")
    : "No remaining 'engineer' wording in any Sanity document.");
}

main().catch((e) => { console.error("FAILED:", e.message); process.exit(1); });
