export function PlaceholderImage({
  label,
  size,
  className = "",
  tag,
  dimension,
}: {
  label: string;
  size?: string;
  className?: string;
  /** top-left corner tag, e.g. "FIG. 01 — ROBOTIC CELL" */
  tag?: string;
  /** bottom-right dimension-line annotation, e.g. "4200 mm" */
  dimension?: string;
}) {
  return (
    <div
      className={`relative border border-border bg-surface-raised ${className}`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg, #E4E8EC 0 6px, transparent 6px 12px)",
      }}
    >
      {tag && (
        <span className="label-caps absolute left-0 top-0 bg-surface-raised px-2 py-1 text-on-surface-muted">
          {tag}
        </span>
      )}
      <div className="flex h-full min-h-[240px] w-full items-center justify-center p-6 text-center">
        <span className="spec-mono text-on-surface-muted">
          {label}
          {size && (
            <>
              <br />
              {size}
            </>
          )}
        </span>
      </div>
      {dimension && (
        <span className="spec-mono absolute bottom-2 right-2 text-on-surface-muted">
          |←— {dimension} —→|
        </span>
      )}
    </div>
  );
}
