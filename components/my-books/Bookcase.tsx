"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { getBook, type ShelfKey } from "@/lib/data";
import { PlusIcon } from "../Icons";
import { useReading } from "../ReadingProvider";
import { SpineFace } from "../Spine";

/** Spine thickness in px, from the page count, kept wide enough to read. */
const thickness = (pages: number) => Math.round(Math.min(56, Math.max(22, 18 + pages * 0.034)));

/** A steady per-book height (86–100% of the shelf), so the row looks like real books. */
const heightFor = (slug: string) => {
  let h = 0;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) % 997;
  return 0.86 + (h % 15) / 100;
};

/**
 * Books shown spine-out on shelves, like a real bookcase. Long shelves wrap onto
 * another plank below. Hover pulls a book out a little; click opens it.
 */
export function Bookcase({ slugs, shelf, onAdd, addLabel }: { slugs: string[]; shelf: ShelfKey; onAdd: () => void; addLabel: string }) {
  const { logOf } = useReading();

  return (
    <ul
      aria-label="Bookcase"
      className="flex flex-wrap items-end gap-x-[3px] [--gap:26px] [--slot:168px] lg:[--slot:200px]"
      style={
        {
          rowGap: "var(--gap)",
          paddingBottom: "var(--gap)",
          // One plank under every row of books: plank, then a soft shadow, then space
          backgroundImage: `repeating-linear-gradient(to bottom,
            transparent 0 var(--slot),
            var(--line) var(--slot) calc(var(--slot) + 9px),
            rgb(0 0 0 / 0.16) calc(var(--slot) + 9px),
            transparent calc(var(--slot) + 16px) calc(var(--slot) + var(--gap)))`,
        } as CSSProperties
      }
    >
      {slugs.map((slug) => {
        const book = getBook(slug);
        const width = thickness(book.pages);
        const log = logOf(slug);
        const pct = Math.round((log.page / book.pages) * 100);
        return (
          <li key={slug} className="flex shrink-0 items-end" style={{ height: "var(--slot)" }}>
            <Link
              href={`/book/${slug}`}
              aria-label={`${book.title} by ${book.author}`}
              title={`${book.title} · ${book.author}`}
              className="group relative block rounded-[3px] outline-offset-2 transition-transform duration-200 ease-out hover:-translate-y-2 focus-visible:-translate-y-2"
              style={{ width, height: `calc(var(--slot) * ${heightFor(slug)})` }}
            >
              <SpineFace
                slug={slug}
                className="h-full w-full rounded-[3px] py-2.5 shadow-[inset_0_-2px_0_rgb(0_0_0/0.25)]"
                titleSize={`${Math.min(14, Math.round(width * 0.48))}px`}
                authorSize="8px"
              />
              {/* Bookmark ribbon on books in progress */}
              {shelf === "reading" && (
                <span
                  aria-hidden
                  className="absolute -top-3 right-1.5 h-6 w-2 bg-accent [clip-path:polygon(0_0,100%_0,100%_100%,50%_78%,0_100%)]"
                  title={`${pct}% read`}
                />
              )}
              <span className="pointer-events-none absolute -top-9 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1 text-[12px] font-semibold text-bg shadow-modal group-hover:block group-focus-visible:block">
                {book.title}
                {shelf === "reading" && ` · ${pct}%`}
                {shelf === "read" && log.rating > 0 && ` · ★ ${log.rating}`}
              </span>
            </Link>
          </li>
        );
      })}
      <li className="flex shrink-0 items-end pl-2" style={{ height: "var(--slot)" }}>
        <button
          onClick={onAdd}
          aria-label={addLabel}
          title={addLabel}
          className="flex w-9 flex-col items-center justify-center gap-2 rounded-[3px] border-2 border-dashed border-line text-muted transition-colors hover:border-accent hover:bg-accent-soft hover:text-accent"
          style={{ height: "calc(var(--slot) * 0.8)" }}
        >
          <PlusIcon size={18} />
          <span className="text-[11px] font-semibold [writing-mode:vertical-rl]">{addLabel}</span>
        </button>
      </li>
    </ul>
  );
}
