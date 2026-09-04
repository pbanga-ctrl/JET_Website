// Canonical smoke-test driver for the JET Automation site.
// Usage:  timeout 60 node .claude/skills/run-jet-site/verify.js [outDir]
// Assumes `npm run dev` is already running on http://localhost:3000.
//
// Why `timeout` wraps this: in this sandbox, closing a Chromium instance
// that has an active WebGL context (the home page's 3D robot arm) can hang
// indefinitely on browser.close(), even though everything up to that point
// completed correctly. Screenshots are flushed to disk before the hang, so
// a `timeout N` exit code of 124/143 is expected and NOT a failure signal
// — check for the screenshot files and the printed ERRORS line instead.

const { chromium } = require("playwright");
const path = require("path");

const BASE = "http://localhost:3000";
const OUT = path.resolve(process.argv[2] || __dirname);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`[console] ${msg.text()}`);
  });
  page.on("pageerror", (err) => errors.push(`[pageerror] ${err.message}`));

  async function shot(name) {
    await page.screenshot({ path: path.join(OUT, `${name}.png`) });
  }

  // Home — full-viewport hero with the 3D robot arm (GSAP DrawSVG timing
  // doesn't apply here, but the Three.js scene + rest-pose settle takes a
  // beat). The header is intentionally hidden until scroll on this page only.
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await shot("home");

  // Services — sticky sub-nav anchors, alternating image/text sections.
  await page.goto(BASE + "/services", { waitUntil: "networkidle" });
  await shot("services");

  // Careers list -> job detail (directional view-transition between these
  // two; both use transitionTypes=['nav-forward'/'nav-back']).
  await page.goto(BASE + "/careers", { waitUntil: "networkidle" });
  await shot("careers");
  await page.click("text=Controls Engineer");
  await page.waitForURL("**/careers/controls");
  await page.waitForSelector("h1:has-text('Controls Engineer')");
  await page.waitForTimeout(600); // let the view-transition settle
  await shot("job-detail");

  // Job apply form -> success state.
  await page.fill("input[type=text]", "Jane Doe");
  await page.fill("input[type=email]", "jane@example.com");
  await page.setInputFiles("input[type=file]", {
    name: "resume.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4"),
  });
  await page.click("button:has-text('Submit application')");
  await page.waitForSelector("text=Received");
  await shot("job-apply-success");

  // Contact form -> success state (hardcoded reference JA-104903).
  await page.goto(BASE + "/contact-us", { waitUntil: "networkidle" });
  await page.fill("input[placeholder='Jane Doe']", "Jane Doe");
  await page.fill("input[placeholder='Acme Manufacturing']", "Acme Mfg");
  await page.fill("input[placeholder='jane@acme.com']", "jane@acme.com");
  await page.fill("textarea", "Need a quote for a robotic cell.");
  await page.click("button:has-text('Send request')");
  await page.waitForSelector("text=JA-104903");
  await shot("contact-success");

  // Login — dark "blueprint mode" page; sign-in always shows the error
  // state, sign-up always shows the success state (both are UI-only stubs).
  await page.goto(BASE + "/login", { waitUntil: "networkidle" });
  await page.fill("input[type=email]", "jane@acme.com");
  await page.fill("input[type=password]", "wrongpass123");
  await page.click("button:has-text('Sign in')");
  await page.waitForSelector("text=Credentials not recognised");
  await shot("login-error");

  // Support — order lookup + FAQ accordion.
  await page.goto(BASE + "/support", { waitUntil: "networkidle" });
  await page.fill("input[placeholder='JA-000000']", "JA-104882");
  await page.fill("input[placeholder='jane@acme.com']", "jane@acme.com");
  await page.click("button:has-text('Look up')");
  await page.waitForSelector("text=Shipped");
  await shot("support-lookup");

  console.log("ERRORS", JSON.stringify(errors));
  await browser.close();
})().catch((e) => {
  console.error("FATAL", e);
  process.exit(1);
});
