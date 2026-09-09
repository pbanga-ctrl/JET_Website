"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { ButtonLink } from "@/components/ui/Button";

const SCROLL_REVEAL_THRESHOLD = 24;

// The old WooCommerce store went away with the WordPress site, and its
// replacement isn't live yet — so there is deliberately no default here.
// While this is unset the Shop link is hidden entirely (see NAV_ITEMS)
// rather than pointing somewhere that 404s. Set NEXT_PUBLIC_SHOP_URL to the
// new storefront's address to bring the link back; it is a build-time value,
// so it takes a redeploy.
const SHOP_URL = process.env.NEXT_PUBLIC_SHOP_URL;

function subscribeToScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

function getScrolledPastThreshold() {
  return window.scrollY > SCROLL_REVEAL_THRESHOLD;
}

type NavItem = {
  label: string;
  href: string;
  external?: boolean;
  children?: { label: string; href: string }[];
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "01 · Industrial Automation", href: "/services#s01" },
      { label: "02 · Electrical Design", href: "/services#s02" },
      { label: "03 · Mechanical Design", href: "/services#s03" },
      { label: "04 · Control Systems", href: "/services#s04" },
      { label: "05 · Robotics", href: "/services#s05" },
      { label: "06 · Industrial Safety", href: "/services#s06" },
    ],
  },
  { label: "Products", href: "/products" },
  ...(SHOP_URL ? [{ label: "Shop", href: SHOP_URL, external: true }] : []),
  { label: "Careers", href: "/careers" },
  { label: "Support", href: "/support" },
];

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  // On the home page the hero fills the viewport, so the header overlays it
  // (fixed, out of flow) rather than pushing it down. On desktop it stays
  // hidden until the user scrolls a bit, keeping the hero uninterrupted.
  // Phones don't get that treatment: the header is the only way to reach the
  // menu, and hiding it left mobile visitors on the home page with no
  // navigation at all until they scrolled. Every other page keeps it sticky,
  // in-flow and visible immediately.
  const scrolledPastThreshold = useSyncExternalStore(
    subscribeToScroll,
    getScrolledPastThreshold,
    () => false
  );
  const revealed = !isHome || scrolledPastThreshold;

  // Mobile menu. Closing on pathname change matters because tapping a link
  // navigates without unmounting the header, so the panel would otherwise
  // stay open over the new page. Adjusted during render rather than in an
  // effect (React's documented pattern for resetting state when a value
  // changes) — that also covers browser back/forward, which an onClick
  // handler on each link would miss.
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  // Don't let the page scroll behind the open panel.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [menuOpen]);

  return (
    <header
      className={`z-50 border-b border-border bg-surface transition-transform duration-300 ease-out ${
        isHome ? "fixed inset-x-0 top-0" : "sticky top-0"
      } ${isHome && !revealed ? "translate-y-0 md:-translate-y-full" : "translate-y-0"}`}
      style={{ viewTransitionName: "site-header" }}
    >
      <div className="mx-auto flex max-w-[1264px] items-center justify-between gap-3 px-5 py-3 sm:px-5 sm:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3 sm:gap-4">
          <Image
            src="/logo/jet-automation-logo.jpg"
            alt="JET Automation"
            width={199}
            height={113}
            priority
            className="h-9 w-auto shrink-0 mix-blend-multiply sm:h-10"
          />
          <span className="label-caps hidden text-[9px] text-on-surface-muted sm:block">
            MISSISSAUGA, ON
            <br />
            EST. 2003
          </span>
        </Link>

        <nav className="hidden items-stretch md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = !item.external && pathname === item.href;

            if (item.external) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-caps relative flex items-center border-r border-border px-4 py-5 text-on-surface transition-colors hover:text-primary"
                >
                  {item.label} ↗
                </a>
              );
            }

            return (
              <div key={item.label} className="group relative">
                <Link
                  href={item.href}
                  className={`label-caps relative flex h-full items-center gap-1.5 border-r border-border px-4 py-5 transition-colors hover:text-primary ${
                    isActive ? "text-primary" : "text-on-surface"
                  }`}
                >
                  {item.label}
                  {item.children && (
                    <svg
                      aria-hidden
                      viewBox="0 0 10 6"
                      className="h-[6px] w-[10px] transition-transform duration-200 group-hover:-rotate-180"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M1 1L5 5L9 1" />
                    </svg>
                  )}
                  <span
                    aria-hidden
                    className={`absolute inset-x-4 -bottom-px h-[2px] origin-left scale-x-0 bg-primary transition-transform duration-200 ease-out group-hover:scale-x-100 ${
                      isActive ? "scale-x-100" : ""
                    }`}
                  />
                </Link>

                {item.children && (
                  <div className="invisible absolute left-0 top-full z-10 min-w-[240px] translate-y-1 border border-border bg-surface opacity-0 shadow-[3px_3px_0_0_var(--color-border)] transition-[opacity,transform,visibility] duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="spec-mono block border-b border-border px-4 py-3 text-on-surface-muted transition-colors last:border-b-0 hover:bg-surface-raised hover:text-primary"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Wrapped in a span rather than given `hidden` directly: ButtonLink's
              own `inline-flex` sits in the same cascade layer and was winning,
              so the login button showed up on phones regardless. */}
          <span className="hidden lg:block">
            <ButtonLink href="/login" variant="secondary">
              Customer Login
            </ButtonLink>
          </span>
          <span className="hidden sm:block">
            <ButtonLink href="/contact-us" variant="primary">
              Contact Us
            </ButtonLink>
          </span>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex h-11 w-11 shrink-0 items-center justify-center border border-border text-on-surface transition-colors hover:border-primary hover:text-primary md:hidden"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
              {menuOpen ? (
                <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
              ) : (
                <path d="M3 6h14M3 10h14M3 14h14" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="max-h-[calc(100dvh-64px)] overflow-y-auto border-t border-border bg-surface md:hidden"
        >
          <nav className="flex flex-col">
            {NAV_ITEMS.map((item) =>
              item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-caps border-b border-border px-5 py-4 text-on-surface"
                >
                  {item.label} ↗
                </a>
              ) : (
                <div key={item.label} className="border-b border-border">
                  <Link
                    href={item.href}
                    className={`label-caps block px-5 py-4 ${
                      pathname === item.href ? "text-primary" : "text-on-surface"
                    }`}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="flex flex-col border-t border-border bg-surface-raised">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="spec-mono px-5 py-3 text-on-surface-muted"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            )}
          </nav>

          <div className="flex flex-col gap-3 p-5">
            <ButtonLink href="/contact-us" variant="primary" className="justify-center sm:hidden">
              Contact Us
            </ButtonLink>
            <ButtonLink href="/login" variant="secondary" className="justify-center">
              Customer Login
            </ButtonLink>
          </div>
        </div>
      )}
    </header>
  );
}
