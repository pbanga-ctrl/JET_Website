// Job detail page for /careers/[slug]. Every slug ROLES defines (including
// ones not linked from the careers list, e.g. "general") gets a page here —
// generateStaticParams pre-renders one at build time per ROLES key, and an
// unknown slug 404s via notFound() rather than rendering a broken page.
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getRoles } from "@/lib/cms/roles";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ApplyForm } from "@/components/careers/ApplyForm";
import { PageTransition } from "@/components/ui/PageTransition";

export async function generateStaticParams() {
  const { roles } = await getRoles();
  return Object.keys(roles).map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/careers/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const { roles } = await getRoles();
  const role = roles[slug];
  return { title: role ? role.title : "Role not found" };
}

export default async function JobDetailPage(
  props: PageProps<"/careers/[slug]">
) {
  const { slug } = await props.params;
  const { roles } = await getRoles();
  const role = roles[slug];
  if (!role) notFound();

  return (
    <PageTransition>
    <section className="mx-auto max-w-[1200px] px-8 pb-24 pt-[88px]">
      <Link
        href="/careers"
        transitionTypes={["nav-back"]}
        className="label-caps text-on-surface-muted transition-colors hover:text-primary"
      >
        ← Careers
      </Link>

      <h1 className="mt-6 text-[44px] font-bold leading-[1.1] tracking-[-0.02em]">
        {role.title}
      </h1>
      <div className="mt-4 flex flex-wrap gap-2">
        {[role.type, role.dept, "Mississauga, ON"].map((tag) => (
          <span
            key={tag}
            className="label-caps border border-border px-3 py-1.5 text-on-surface-muted"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Eyebrow>The role</Eyebrow>
          <p className="mt-4 max-w-[42rem] text-lg">{role.blurb}</p>

          <Eyebrow className="mt-12">Responsibilities</Eyebrow>
          <ul className="mt-4 flex flex-col gap-2">
            {role.duties.map((d) => (
              <li key={d} className="flex gap-3 text-on-surface-muted">
                <span className="text-primary">+</span>
                {d}
              </li>
            ))}
          </ul>

          <Eyebrow className="mt-12">Requirements</Eyebrow>
          <ul className="mt-4 flex flex-col gap-2">
            {role.reqs.map((r) => (
              <li key={r} className="flex gap-3 text-on-surface-muted">
                <span className="text-primary">+</span>
                {r}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-24">
            <ApplyForm role={{ slug: role.slug, title: role.title }} />
          </div>
        </div>
      </div>
    </section>
    </PageTransition>
  );
}
