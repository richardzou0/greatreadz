// A rounded bar that sweeps in on first paint and eases to new values when they change.
// The width is right from the first render, so it never depends on JavaScript to show up.
export function ProgressBar({
  value,
  className = "",
  height = 8,
  fill = "var(--accent)",
  track = "var(--line)",
  label,
}: {
  value: number;
  className?: string;
  height?: number;
  fill?: string;
  track?: string;
  label?: string;
}) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={`w-full overflow-hidden rounded-full ${className}`}
      style={{ height, background: track }}
    >
      <div
        className="animate-sweep h-full rounded-full transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ width: `${pct}%`, background: fill }}
      />
    </div>
  );
}
