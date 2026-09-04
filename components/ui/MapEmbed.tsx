// Google Maps embed with no API key or billing required — the
// "/maps?q=...&output=embed" URL is Google's own free "share > embed a map"
// link format, distinct from the paid Maps Embed/JavaScript APIs. Swap the
// `query` prop if the office address ever changes.
export function MapEmbed({
  query,
  label,
  className = "",
}: {
  query: string;
  label: string;
  className?: string;
}) {
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  return (
    <div className={`border border-border ${className}`}>
      <iframe
        src={src}
        title={label}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full border-0"
      />
    </div>
  );
}
