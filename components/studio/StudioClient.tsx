"use client";

// Sanity Studio, loaded client-side only.
//
// Two separate reasons this can't be rendered on the server:
//
// 1. sanity.config.ts embeds real functions (schema `validation` rules, field
//    `hidden` callbacks, default icons). Passing that config as a prop from a
//    Server Component would mean serializing functions across the
//    server/client boundary, which Next.js 16 rejects — hence the config is
//    imported inside client code rather than handed down.
// 2. Studio ships React-Compiler-built code that calls `useMemoCache`, which
//    is null during SSR: it threw "Cannot read properties of null (reading
//    'useMemoCache')" and returned a hard 500 in production. Dev only masked
//    it by falling back to client rendering.
//
// next/dynamic with ssr:false keeps it off the server entirely. Documented as
// the supported way to skip prerendering, and only valid inside a Client
// Component — which this is.
import dynamic from "next/dynamic";

const Studio = dynamic(() => import("./StudioInner"), {
  ssr: false,
  loading: () => (
    <div style={{ padding: "4rem", textAlign: "center", fontFamily: "system-ui" }}>
      Loading Studio…
    </div>
  ),
});

export function StudioClient() {
  return <Studio />;
}
