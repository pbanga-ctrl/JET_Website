// Shared button styling for both real <button>s (Button) and link-styled
// CTAs (ButtonLink) so the two never visually drift apart. ButtonLink picks
// between a Next <Link> (internal routes, with optional view-transition
// tagging) and a plain <a target="_blank"> (external) based on `external`.
import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type Variant =
  | "primary"
  | "primary-on-dark"
  | "signal"
  | "secondary"
  | "secondary-on-dark";

// Same hard-edged "drafted double line" offset used for floating dropdown
// panels (see Header) instead of a soft drop-shadow/glow — the button lifts
// toward the viewer on hover and presses flush again on click.
const INK_ON_LIGHT = "hover:shadow-[5px_5px_0_0_var(--color-on-surface)]";
const INK_ON_DARK = "hover:shadow-[5px_5px_0_0_var(--color-on-dark)]";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: `bg-primary text-surface hover:bg-primary-deep ${INK_ON_LIGHT}`,
  "primary-on-dark":
    `bg-primary-bright text-secondary hover:bg-[color-mix(in_srgb,var(--color-primary-bright)_85%,white)] ${INK_ON_DARK}`,
  signal: `bg-tertiary text-on-surface hover:bg-tertiary-deep ${INK_ON_LIGHT}`,
  secondary:
    `bg-transparent text-primary border border-primary hover:bg-primary hover:text-surface ${INK_ON_LIGHT}`,
  // Vivid Royal disappears against Prussian Blue, so the dark-band outline
  // button swaps to primary-bright per DESIGN.md's contrast rule.
  "secondary-on-dark":
    `bg-transparent text-primary-bright border border-primary-bright hover:bg-primary-bright hover:text-secondary ${INK_ON_DARK}`,
};

const base =
  "label-caps inline-flex items-center justify-center px-[32px] py-[16px] transition-[background-color,color,transform,box-shadow] duration-150 ease-out hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 active:shadow-none";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`${base} ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  className = "",
  external = false,
  href,
  children,
  transitionTypes,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  external?: boolean;
  href: string;
  transitionTypes?: string[];
}) {
  const classes = `${base} ${VARIANT_CLASSES[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...props}>
        {children} ↗
      </a>
    );
  }

  return (
    <Link href={href} className={classes} transitionTypes={transitionTypes} {...props}>
      {children}
    </Link>
  );
}
