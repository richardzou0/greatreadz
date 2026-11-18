"use client";

import { useRef } from "react";
import { useShelfReveal } from "./useShelfReveal";

/**
 * A list of books that plays the shelf reveal: spines first, then covers fanning out to the right.
 * `replayKey` names the list. Each name plays once per page load (e.g. one per shelf tab).
 */
export function ShelfReveal({
  replayKey,
  className = "",
  children,
}: {
  replayKey: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLUListElement>(null);
  useShelfReveal(ref, replayKey);
  return (
    <ul ref={ref} data-shelf-reveal="pending" className={className}>
      {children}
    </ul>
  );
}
