// Site-wide footer, rendered once by app/layout.tsx below every page's
// content. Link columns are plain data below — add a link by adding an
// entry to the relevant *_LINKS array, no markup changes required.
import Link from "next/link";

const COMPANY_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Contact us", href: "/contact-us" },
  { label: "Careers", href: "/careers" },
];

const CARE_LINKS = [
  { label: "Check your order", href: "/support" },
  { label: "Shipping & delivery", href: "/support" },
  { label: "Returns & refunds", href: "/support" },
  { label: "FAQ", href: "/support" },
];

const TRUST_LINKS = [
  { label: "Cookies policy", href: "/cookie-policy" },
  { label: "Terms and conditions", href: "/terms-and-conditions" },
  { label: "Privacy policy", href: "/privacy-policy" },
];

export function Footer() {
  return (
    <footer className="border-t border-border-dark bg-secondary text-on-dark">
      <div className="mx-auto grid max-w-[1264px] grid-cols-2 gap-x-8 gap-y-10 px-8 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr]">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-3">
            <span className="label-caps flex h-[30px] w-[30px] items-center justify-center bg-primary-bright text-secondary">
              JA
            </span>
            <span className="text-[17px] font-bold tracking-[-0.01em]">
              JET AUTOMATION
            </span>
          </div>
          <p className="mt-4 max-w-[26ch] text-sm text-on-dark-muted">
            Fast. Efficient. Reliable. Automation and controls engineering
            since 2003.
          </p>
        </div>

        <FooterColumn title="Company">
          {COMPANY_LINKS.map((l) => (
            <FooterLink key={l.label} href={l.href}>
              {l.label}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title="Customer care">
          {CARE_LINKS.map((l) => (
            <FooterLink key={l.label} href={l.href}>
              {l.label}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title="Trust">
          {TRUST_LINKS.map((l) => (
            <FooterLink key={l.label} href={l.href}>
              {l.label}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title="Contact">
          <span className="text-sm text-on-dark-muted">
            7676 Kimbel St, Units 8–13
            <br />
            Mississauga, ON L5S 1J8
          </span>
          <a
            href="mailto:info@jetautomation.ca"
            className="text-sm text-on-dark hover:text-primary-bright"
          >
            info@jetautomation.ca
          </a>
          <a
            href="tel:18779048724"
            className="text-sm text-on-dark hover:text-primary-bright"
          >
            1-877-904-8724
          </a>
        </FooterColumn>
      </div>

      <div className="border-t border-border-dark px-8 py-6">
        <div className="mx-auto flex max-w-[1264px] flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="spec-mono max-w-[80ch] text-xs text-on-dark-muted">
            JET Automation is not an authorized distributor or representative
            of every product featured on this site. All product names,
            trademarks and logos are the property of their respective owners.
          </p>
          <p className="spec-mono whitespace-nowrap text-xs text-on-dark-muted">
            © 2026 JET Automation Inc.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="label-caps text-on-dark-muted">{title}</p>
      {children}
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="text-sm text-on-dark hover:text-primary-bright">
      {children}
    </Link>
  );
}
