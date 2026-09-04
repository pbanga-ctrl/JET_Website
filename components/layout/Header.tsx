"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { ButtonLink } from "@/components/ui/Button";

const SCROLL_REVEAL_THRESHOLD = 24;

// Defaults to the store's current address on WordPress, so nothing breaks
// before the migration; override once it lives on its own subdomain.
const SHOP_URL = process.env.NEXT_PUBLIC_SHOP_URL || "https://jetautomation.ca/shop/";

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
  // The WooCommerce store still runs on WordPress. It has to move to its own
  // subdomain before the root domain points at this site, or /shop/ (and the
  // cart, checkout and account pages under it) 404 at cutover. Flip
  // NEXT_PUBLIC_SHOP_URL to the new address the moment that move is done —
  // it is a build-time value, so it takes a redeploy.
  { label: "Shop", href: SHOP_URL, external: true },
  { label: "Careers", href: "/careers" },
  { label: "Support", href: "/support" },
];

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  // On the home page the hero fills the viewport, so the header overlays it
  // (fixed, out of flow) rather than pushing it down, and stays hidden until
  // the user scrolls a bit. Every other page keeps it sticky, in-flow and
  // visible immediately.
  const scrolledPastThreshold = useSyncExternalStore(
    subscribeToScroll,
    getScrolledPastThreshold,
    () => false
  );
  const revealed = !isHome || scrolledPastThreshold;

  return (
    <header
      className={`z-50 border-b border-border bg-surface transition-transform duration-300 ease-out ${
        isHome ? "fixed inset-x-0 top-0" : "sticky top-0"
      } ${isHome && !revealed ? "-translate-y-full" : "translate-y-0"}`}
      style={{ viewTransitionName: "site-header" }}
    >
      <div className="mx-auto flex max-w-[1264px] items-center justify-between px-8 py-3">
        <Link href="/" className="flex items-center gap-4">
          <Image
            src="/logo/jet-automation-logo.jpg"
            alt="JET Automation"
            width={199}
            height={113}
            priority
            className="h-10 w-auto mix-blend-multiply"
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

        <div className="flex items-center gap-3">
          <ButtonLink href="/login" variant="secondary" className="hidden sm:inline-flex">
            Customer Login
          </ButtonLink>
          <ButtonLink href="/contact-us" variant="primary">
            Contact Us
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
