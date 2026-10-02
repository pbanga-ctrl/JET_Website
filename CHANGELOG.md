# Changelog

What has shipped to **jetautomation.ca**, newest first. Pushing to `master`
deploys automatically via Vercel, so everything listed here is live.

---

## 2026-10-02

### Storefront moved to WooCommerce's Store API — no credentials needed
The catalogue was rendering empty in production: the admin REST API
(`/wc/v3`) returned 401 because the consumer key/secret stored in Vercel did
not match, and a 401 there looks exactly like "no products".

Switched to the **Store API** (`/wc/store/v1`), which WooCommerce provides for
headless storefronts and which requires no authentication at all. That removes
the entire class of failure rather than debugging the keys. It also takes
categories by slug directly (no id lookup), and exposes cart endpoints, so a
cart on this site can use the same surface later.

`WOO_CONSUMER_KEY` and `WOO_CONSUMER_SECRET` are no longer used and can be
deleted from Vercel.

Handled along the way: Store API prices are minor units (59900 means $599.00)
and its text is HTML-encoded, so both are normalised before they reach the UI.

Verified against the live store with no credentials: 56 products, grippers
2/2, on-sale 5, price 0–100 returns 7, search "gripper" returns 2.

## 2026-10-02

### Storefront auth: fall back to query-string credentials
WooCommerce calls from Vercel were returning 401 while the same request with
the same key succeeded from a laptop. Two causes look identical from the
outside: wrong credentials, or a host stripping the `Authorization` header
before PHP sees it (common on Apache/LiteSpeed).

The client now tries header auth, and on a 401 retries with
`consumer_key`/`consumer_secret` as query parameters over HTTPS — WooCommerce
supports both. If both are rejected the log says so explicitly, which
distinguishes "header stripped" from "credentials wrong" instead of leaving
an empty catalogue and no explanation.

## 2026-10-02

### Storefront rebuilt as a proper shop
`/shop` is now a full catalogue browser rather than a plain grid:

- **Filter sidebar** — search by name or part number, price range (min/max),
  in-stock only, on-sale only, and a full category list with live counts.
- **Sorting** — A–Z, price ascending, price descending, newest.
- **Quick preview** — a panel on each tile showing photo, price, stock,
  category and summary, with add-to-cart, without leaving the grid.
- **Real pagination** — reads WooCommerce's result headers, so it reports
  "Page 1 of 3" and "56 items" honestly instead of guessing.

Every filter is a URL parameter, so results are server-rendered, shareable,
linkable and crawlable, and the page still works with JavaScript disabled.
Only the preview panel needs the browser.

Verified against the live catalogue: grippers 2/2, on-sale 5, price 0–100
returns 7, search "gripper" returns 2, 56 total paginating at 24.

### Storefront robustness fixes
- `WOO_API_URL` is normalised — a trailing slash produced `…//wp-json/…`,
  which fails while *looking* like an empty catalogue rather than an error.
- Requests now send a real `User-Agent`; some managed hosts' firewalls reject
  requests without one.
- Failed WooCommerce calls log their status and response body, so the cause is
  visible in platform logs instead of silently returning nothing.

---

## 2026-10-01

### Headless storefront
Browsing moved onto this site; buying stays in WooCommerce. `/shop` and
`/shop/[slug]` render the live catalogue in the site's design, and add-to-cart
deep-links into WooCommerce, which keeps cart, checkout, Stripe, shipping and
order history.

Credentials are server-only and Read-permission, so the site cannot alter
stock, prices or orders. Catalogue responses cache for 5 minutes, categories
for an hour.

**Bug caught before release:** WooCommerce's `category` parameter takes a
category ID, not a slug. Passing a slug returns an empty array with a `200`, so
every category filter would have rendered an empty grid while appearing
healthy.

### SEO: canonical URLs corrected
The apex 308-redirects to `www`, but `metadataBase`, the sitemap and
`robots.txt` all advertised the apex — so every sitemap URL pointed at a
redirect, and a Search Console URL-prefix property for the apex would show
almost no data. Added per-route canonical tags, which the site previously had
none of.

---

## 2026-09-29

### Site assistant
A chat widget answering as a member of the team, grounded in the site's own CMS
content, able to take a service or project enquiry and hand it to the same n8n
workflow the contact form uses.

Compliance is enforced rather than hoped for: the system prompt forbids the
regulated wording, and the route scrubs model output before returning it —
which is why replies are buffered rather than streamed, since a streamed token
cannot be recalled.

Fails closed: the widget renders nothing without `NEXT_PUBLIC_CHAT_ENABLED`,
and the route returns 503 without `ANTHROPIC_API_KEY`.

---

## 2026-09-25

### PEO compliance — regulated terminology removed
Following the notice from Professional Engineers Ontario (L03 26-OI 18359)
citing s.12(2) and s.40 of the *Professional Engineers Act*, every use of
"engineer", "engineers" and "engineering" was replaced site-wide — including
instances PEO did not cite.

The live copy is served from Sanity, not the source files, so a CMS patch
script was written and run alongside the code changes; fixing the source alone
would have left the wording public.

Deliberately kept: "reverse engineer" in the terms of use — standard boilerplate
about the website, not a representation about services.

---

## 2026-09-24

### Careers
Application form gained phone, LinkedIn/portfolio and availability fields.
Mechanical Designer became full-time; an Electrician posting was added.

---

## Earlier

Mobile layout and navigation overhaul (the site had no navigation at all on
phones), consent-gated analytics, Search Console verification carried over from
WordPress, Sanity CMS wired up and seeded, SEO dashboard, reCAPTCHA and n8n
form delivery, and the move from WordPress to Vercel.
