---
name: run-jet-site
description: Launch and visually verify the JET Automation Next.js site (in web/) in a real browser. Use this whenever asked to run, start, preview, or screenshot the site, or to confirm a UI/style/animation change actually works — not just that the build passes. Covers the dev-server start/stop, the Playwright driver script, and this sandbox's specific quirks (no chromium-cli, WebGL browser-close hangs, Tailwind v4 spacing-scale collisions).
---

# Running and verifying the JET Automation site

This is a Next.js 16 (App Router) + React 19 + Tailwind v4 + GSAP +
Three.js/@react-three/fiber marketing site. The project root for all
commands below is `web/` (that's where `package.json`, `node_modules`,
and this `.claude/` directory live — not the repo's outer folder).

## Dev server

```bash
cd web
npm run dev &
timeout 30 bash -c 'until curl -sf http://localhost:3000 >/dev/null; do sleep 1; done'
```

Stop it with `lsof -ti:3000 -sTCP:LISTEN | xargs -r kill` before relaunching
(or just reuse the existing one — check with `curl -s -o /dev/null -w
"%{http_code}" http://localhost:3000` first; if it's already `200`, don't
start a second instance).

Production build check (`npm run build`) and `npm run lint` both take
5–40s depending on whether the large hero photo (`public/images/hero-plant.jpg`,
~17MB source) needs re-optimizing; that's normal, not a hang.

## Driving it in a browser

**`chromium-cli` is not installed on this machine.** Playwright is a
devDependency of this project instead (`npm install -D playwright` +
`npx playwright install chromium` — already done; re-run only if
`node_modules` was reinstalled from scratch). Use the canonical driver:

```bash
timeout 60 node .claude/skills/run-jet-site/verify.js [outDir]
```

- Screenshots land in `outDir` (defaults to this skill's own folder) named
  `home.png`, `services.png`, `careers.png`, `job-detail.png`,
  `job-apply-success.png`, `contact-success.png`, `login-error.png`,
  `support-lookup.png`.
- It prints an `ERRORS [...]` line (console errors + page errors collected
  during the run) — should be `[]`.
- **Always wrap it in `timeout N`, and treat a 124/143 exit code as
  informational, not a failure.** In this sandbox, `browser.close()` can
  hang indefinitely once a page has created a WebGL context (the home
  page's 3D robot arm hero does this every time). The script writes each
  screenshot to disk *before* that final close call, so check the output
  files and the `ERRORS` line — don't gate success on the process exiting
  cleanly.
- Benign noise to ignore in console output: `THREE.Clock: This module has
  been deprecated`, and repeated `GL Driver Message ... GPU stall due to
  ReadPixels` warnings. Neither indicates a real problem.
- For one-off checks beyond the 7 routes above, write a throwaway script
  next to `verify.js` (or in a scratchpad) following the same pattern:
  `chromium.launch()` → `newPage()` → collect `console`/`pageerror` →
  `goto(..., { waitUntil: "networkidle" })` → act → `screenshot()`.

## Things that look like bugs but aren't (yet)

- **Home hero has no visible header on load.** Intentional — the header
  is `fixed` + hidden on `/` only, revealing on scroll past ~24px
  (`components/layout/Header.tsx`, via `useSyncExternalStore` on
  `window.scrollY`). Every other route keeps the header sticky and
  always visible.
- **The 3D robot arm can take ~1–2s after `networkidle` to reach its rest
  pose and pick up correct lighting.** It's a SolidWorks GLB with no
  bones/rig; `components/home/RobotArmScene.tsx` reconstructs a kinematic
  chain from the part names at runtime. Give it a beat before screenshotting.
- **Forms "succeed" no matter what you type.** All forms on this site
  (apply, contact, login, signup, order lookup) are prototype-only —
  wired to local component state, not a backend. That's per the original
  design brief, not a bug to fix.

## A real bug class to watch for: Tailwind v4 theme-token collisions

`app/globals.css` defines custom design tokens under `@theme inline`. If
you (or a future edit) add a new `--spacing-<name>` key that happens to
match one of Tailwind's own built-in named spacing scale keys (`xs`, `sm`,
`md`, `lg`, `xl`, `2xl`, ...), it **silently replaces** Tailwind's value
for every utility that reads that scale — not just spacing utilities, but
`max-w-*`, `size-*`, `w-*` etc. too. This exact bug shipped once already
(custom `--spacing-xl: 64px` broke every `max-w-xl` on the site down to
64px, wrapping paragraphs to one word per line) and was only caught by
screenshotting and reading the *compiled* CSS
(`curl .../_next/static/chunks/*.css | grep -A2 'max-w-xl'`) to see what
CSS variable a utility actually resolved to. If a layout looks
inexplicably squeezed after a token change, check that first.

## Design reference

`../../../DESIGN.md` (repo root, one level up from `web/`) is the
authoritative "Blueprint Signal" design system — colors, type scale,
spacing, component rules, animation vocabulary. Check it before making
visual judgment calls (e.g., whether something should use `primary` vs
`primary-bright`, whether a new animation fits the sanctioned list).
