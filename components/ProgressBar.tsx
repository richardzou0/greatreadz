"use client";

import { useEffect, useState } from "react";

// A rounded bar that eases to its value — on first load and every time it changes.
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
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(value));
    return () => cancelAnimationFrame(id);
  }, [value]);

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
        className="h-full rounded-full transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ width: `${Math.min(100, Math.max(0, shown))}%`, background: fill }}
      />
    </div>
  );
}
