// The "01 / TAG — title — body" card used for service/about/careers grids
// site-wide. Split into Inner (the actual content) and NumberedCard (which
// decides whether to wrap it in a Link, since only some cards are clickable)
// so the hover-reveal dimension-line SVG only has to be written once.
import Link from "next/link";
import { Card } from "./Card";

function Inner({
  index,
  tag,
  title,
  dark,
  children,
}: {
  index: string;
  tag: string;
  title?: string;
  dark?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-full">
      <p className={`label-caps ${dark ? "text-primary-bright" : "text-primary"}`}>
        {index} / {tag}
      </p>
      {title && (
        <h3 className="mt-4 text-[22px] font-bold leading-[1.3]">{title}</h3>
      )}
      <p className={`mt-3 ${dark ? "text-on-dark-muted" : "text-on-surface-muted"}`}>
        {children}
      </p>
      {/* dimension-line annotation, revealed on card hover */}
      <svg
        aria-hidden
        viewBox="0 0 60 12"
        className={`absolute bottom-0 right-0 h-3 w-14 opacity-0 transition-opacity duration-150 group-hover:opacity-100 ${dark ? "text-primary-bright" : "text-primary"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M 0 6 L 60 6 M 0 0 L 0 12 M 60 0 L 60 12" />
      </svg>
    </div>
  );
}

export function NumberedCard({
  index,
  tag,
  title,
  children,
  href,
  dark = false,
}: {
  index: string;
  tag: string;
  title?: string;
  children: React.ReactNode;
  href?: string;
  dark?: boolean;
}) {
  if (href) {
    return (
      <Link href={href} className="group block h-full">
        <Card
          dark={dark}
          regMark
          className={`h-full transition-colors duration-150 ${dark ? "group-hover:border-primary-bright" : "group-hover:border-primary"}`}
        >
          <Inner index={index} tag={tag} title={title} dark={dark}>
            {children}
          </Inner>
        </Card>
      </Link>
    );
  }

  return (
    <div className="group h-full">
      <Card dark={dark} regMark className="h-full">
        <Inner index={index} tag={tag} title={title} dark={dark}>
          {children}
        </Inner>
      </Card>
    </div>
  );
}
