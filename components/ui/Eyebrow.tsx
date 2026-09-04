// Small label-with-a-tick-mark that sits above section headings site-wide
// (e.g. "Industrial automation · controls · robotics"). `dark` swaps the
// tick/text color for use on dark-band sections.
export function Eyebrow({
  children,
  dark = false,
  className = "",
}: {
  children: React.ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`label-caps flex items-center gap-3 ${dark ? "text-on-dark-muted" : "text-on-surface-muted"} ${className}`}
    >
      <span
        className={`inline-block h-px w-8 ${dark ? "bg-border-dark" : "bg-border"}`}
      />
      {children}
    </div>
  );
}
