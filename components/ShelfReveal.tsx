"use client";

import { useRef } from "react";
import { useShelfReveal } from "./useShelfReveal";

/**
 * A list of books that plays the shelf reveal: spines first, then covers fanning out to the right.
 * Change `replayKey` to play it again (e.g. when switching shelves or filters).
 */
export function ShelfReveal({
  replayKey,
  className = "",
  children,
}: {
  replayKey: unknown;
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
