"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { books, discoverPicks, shelves, type ShelfKey } from "@/lib/data";
import { BookCover } from "../BookCover";
import { CheckIcon, CloseIcon, PlusIcon, SearchIcon } from "../Icons";
import { useReading, type Status } from "../ReadingProvider";
import { useDialogFocus } from "../useDialogFocus";

const matchOf = Object.fromEntries(discoverPicks.map((p) => [p.slug, p.match]));
const shelfLabel = Object.fromEntries(shelves.map((s) => [s.key, s.label]));

// What each shelf's sheet says, which books it can take, and how adding works.
// Want to read adds straight away. The others open the log sheet so you can set
// your page or rating; nothing is added if you cancel there.
const SETUP: Record<ShelfKey, { title: string; hint: string; from: (ShelfKey | null)[]; log?: Status }> = {
  want: { title: "Add to Want to read", hint: "Best matches for your taste first", from: [null] },
  reading: { title: "Start a book", hint: "Pick one, then set the page you're on", from: [null, "want"], log: "reading" },
  read: { title: "Log a finished book", hint: "Pick one, then give it a rating", from: [null, "want", "reading", "dnf"], log: "finished" },
  dnf: { title: "Log a book you didn't finish", hint: "Pick one, then set where you stopped", from: [null, "want", "reading"], log: "dnf" },
};

// Search the catalogue and put books on a shelf.
export function AddBooksSheet({ shelf, onClose }: { shelf: ShelfKey; onClose: () => void }) {
  const { shelfOf, setShelf, openLog } = useReading();
  const setup = SETUP[shelf];
  const [query, setQuery] = useState("");
  // Remember what was added here so those rows can be undone instead of disappearing.
  const [added, setAdded] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(dialogRef);

  // Latest close handler, so the setup below runs once per open (not on every re-render).
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeRef.current();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, []);

  // Books that can move onto this shelf. Unshelved ones first, best matches for Rich's taste first.
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return Object.values(books)
      .filter((b) => setup.from.includes(shelfOf(b.slug)) || added.includes(b.slug))
      .filter((b) => !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q))
      .sort((a, b) => Number(!!shelfOf(a.slug)) - Number(!!shelfOf(b.slug)) || (matchOf[b.slug] ?? 0) - (matchOf[a.slug] ?? 0));
  }, [query, shelfOf, added, setup]);

  const choose = (slug: string) => {
    if (setup.log) {
      // Hand over to the log sheet; saving it puts the book on this shelf.
      onClose();
      openLog(slug, setup.log);
      return;
    }
    if (shelfOf(slug) === shelf) {
      setShelf(slug, null);
      setAdded((a) => a.filter((s) => s !== slug));
    } else {
      setShelf(slug, shelf);
      setAdded((a) => [...a, slug]);
    }
  };

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-end justify-center bg-backdrop lg:items-center lg:p-8"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={setup.title}
        className="animate-sheet lg:animate-modal flex max-h-[88dvh] w-full flex-col rounded-t-[28px] bg-bg shadow-modal lg:max-w-[560px] lg:rounded-[24px]"
      >
        <div className="px-5 pt-3 lg:px-7 lg:pt-7">
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line lg:hidden" />
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-[24px] font-medium leading-tight">{setup.title}</h2>
              <p className="mt-0.5 text-[13px] text-muted">{added.length ? `${added.length} added` : setup.hint}</p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-surface transition-colors hover:bg-accent-soft"
            >
              <CloseIcon size={18} />
            </button>
          </div>
          <div className="mt-4 flex h-12 items-center gap-3 rounded-full border border-line bg-surface px-4 focus-within:border-accent">
            <SearchIcon size={18} className="shrink-0 text-muted" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or author"
              aria-label="Search by title or author"
              className="h-full min-w-0 flex-1 bg-transparent text-[15px] placeholder:text-muted focus:outline-none"
            />
          </div>
        </div>

        <ul className="mt-3 flex-1 overflow-y-auto px-3 pb-3 lg:px-5">
          {results.length === 0 && (
            <li className="px-2 py-6 text-center text-[14px] text-muted">
              {query ? `No books match “${query}” yet.` : "Every book in the catalogue is already on a shelf."}
            </li>
          )}
          {results.map((b) => {
            const current = shelfOf(b.slug);
            const on = current === shelf;
            return (
              <li key={b.slug}>
                <div className="flex items-center gap-3 rounded-2xl p-2 hover:bg-surface">
                  <BookCover slug={b.slug} href={null} size="sm" className="w-11 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-serif text-[17px] font-medium">{b.title}</p>
                    <p className="truncate text-[13px] text-muted">
                      {b.author}
                      {current && !on ? (
                        <span> · on {shelfLabel[current]}</span>
                      ) : matchOf[b.slug] ? (
                        <span className="font-semibold text-accent"> · {matchOf[b.slug]}% match</span>
                      ) : null}
                    </p>
                  </div>
                  <button
                    onClick={() => choose(b.slug)}
                    aria-pressed={setup.log ? undefined : on}
                    aria-label={on ? `Remove ${b.title} from ${shelfLabel[shelf]}` : `Add ${b.title} to ${shelfLabel[shelf]}`}
                    className={`flex h-11 shrink-0 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold transition-all active:scale-95 ${
                      on ? "bg-accent text-on-accent" : "border border-accent text-accent hover:bg-accent-soft"
                    }`}
                  >
                    {on ? <CheckIcon size={15} /> : <PlusIcon size={15} />}
                    {on ? "Added" : current ? "Move" : "Add"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="border-t border-line px-5 py-4 lg:px-7">
          <button
            onClick={onClose}
            className="h-12 w-full rounded-full bg-accent text-[15px] font-semibold text-on-accent transition-transform active:scale-[0.98]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
