// Bordered content box used throughout the site (forms, stat blocks, FAQ
// policy tiles). `dark` swaps to the secondary/on-dark palette for
// dark-band sections; `regMark` adds the small corner "registration mark"
// styling (see globals.css / DESIGN.md) used on NumberedCard.
export function Card({
  children,
  dark = false,
  regMark = false,
  className = "",
}: {
  children: React.ReactNode;
  dark?: boolean;
  regMark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`border p-8 ${dark ? "border-border-dark bg-secondary-raised text-on-dark" : "border-border bg-surface-raised text-on-surface"} ${regMark ? "reg-mark" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
