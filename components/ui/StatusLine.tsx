// Small success/error status message (■ or ⚠ + text) used after form
// submissions and order lookups site-wide.
const COLORS = {
  success: "text-success",
  error: "text-error",
} as const;

// Oxide red (#A3251C) doesn't clear 4.5:1 on the Prussian-blue ground, so
// dark-mode error text lifts to a lighter tint — see DESIGN.md's contrast rule.
const DARK_COLORS = {
  success: "text-success",
  error: "text-[#F0A8A2]",
} as const;

export function StatusLine({
  state,
  dark = false,
  children,
}: {
  state: keyof typeof COLORS;
  dark?: boolean;
  children: React.ReactNode;
}) {
  return (
    <p
      className={`spec-mono flex items-center gap-2 ${(dark ? DARK_COLORS : COLORS)[state]}`}
    >
      <span aria-hidden>{state === "success" ? "■" : "⚠"}</span>
      {children}
    </p>
  );
}
