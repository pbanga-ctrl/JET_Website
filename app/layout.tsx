// Root layout — wraps every route in the app. Anything rendered here
// (fonts, Header, Footer, the cookie banner) is present on every page;
// per-page content only ever fills in `children` inside <main>.
import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsentBanner } from "@/components/legal/CookieConsentBanner";
import { Analytics } from "@/components/analytics/Analytics";
import "./globals.css";

// next/font downloads + self-hosts these at build time and exposes each as
// a CSS variable (--font-archivo / --font-plex-mono) instead of a <link>
// tag, so there's no render-blocking request to Google Fonts at runtime.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// Default <title>/<meta description> for every route; a page can override
// just the title via its own `export const metadata`, which fills the
// "%s" in the template below (e.g. "Careers · JET Automation").
export const metadata: Metadata = {
  metadataBase: new URL("https://jetautomation.ca"),
  title: {
    default: "JET Automation",
    template: "%s · JET Automation",
  },
  description:
    "JET Automation designs and builds industrial automation: robotic cells, control systems, electrical panels, safety upgrades, and off-the-shelf equipment like palletizers, box erectors and OEE monitoring.",
  // Carried over from the WordPress site so Google Search Console ownership
  // survives the cutover — without this, verification lapses the moment the
  // domain stops serving the old site and has to be re-established.
  verification: { google: "5Hx7lzLiWgJxkRt1hzfB9ZxO94dujmKaAgIuHnO2pF8" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieConsentBanner />
        <Analytics />
      </body>
    </html>
  );
}
