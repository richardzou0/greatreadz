"use client";

import { useState } from "react";

const CELL =
  "flex h-11 w-full items-center justify-center gap-3 whitespace-nowrap rounded-xl border border-line bg-surface px-1 text-[13px] font-semibold transition-colors hover:border-accent/50 lg:justify-between lg:whitespace-normal lg:px-4 lg:text-[14px] lg:leading-tight";

/**
 * Where to get the book. Greatreadz isn't monetized, so there are no store links:
 * "Borrow" opens the book on Open Library (a free, non-profit library catalogue),
 * and the made-up stores explain themselves instead of going nowhere.
 */
export function GetIt({ title, author }: { title: string; author: string }) {
  const [note, setNote] = useState<string | null>(null);
  const library = `https://openlibrary.org/search?${new URLSearchParams({ title, author })}`;
  const fictional = (store: string) =>
    setNote(`${store} is made up for this concept. Greatreadz isn't monetized, so there are no store links. Try borrowing it instead.`);

  return (
    <>
      <ul className="grid grid-cols-3 gap-2 lg:mt-3 lg:grid-cols-1">
        <li>
          <button onClick={() => fictional("Yamazon")} className={CELL}>
            <span className="lg:hidden">Buy on Yamazon</span>
            <span className="hidden lg:inline">Buy on Yamazon</span>
            <span className="hidden font-medium text-muted lg:inline">Paperback, Quindle</span>
          </button>
        </li>
        <li>
          <a href={library} target="_blank" rel="noopener noreferrer" className={CELL}>
            <span className="lg:hidden">Borrow free</span>
            <span className="hidden lg:inline">Borrow from your library</span>
            <span className="hidden font-medium text-muted lg:inline">Open Library ↗</span>
          </a>
        </li>
        <li>
          <button onClick={() => fictional("Baudible")} className={CELL}>
            <span className="lg:hidden">Audiobook</span>
            <span className="hidden lg:inline">Listen on Baudible</span>
            <span className="hidden font-medium text-muted lg:inline">Audiobook</span>
          </button>
        </li>
      </ul>
      {note && (
        <p role="status" className="animate-fade-in mt-2.5 rounded-xl bg-accent-soft px-3.5 py-2.5 text-[13px] leading-snug text-accent">
          {note}
        </p>
      )}
    </>
  );
}
