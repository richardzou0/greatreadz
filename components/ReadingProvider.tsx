"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { books, summarise, type ShelfKey } from "@/lib/data";
import { LogSheet } from "./LogSheet";

export type Status = "reading" | "finished" | "dnf";
export type Shelf = ShelfKey | null;
export type Log = { slug: string; page: number; status: Status; rating: number; note: string };

type Ctx = {
  logOf: (slug: string) => Log;
  saveLog: (next: Log) => void;
  openLog: (slug: string, status?: Status) => void;
  shelfOf: (slug: string) => Shelf;
  setShelf: (slug: string, shelf: Shelf) => void;
  /** Books on a shelf, in catalogue order */
  onShelf: (shelf: ShelfKey) => string[];
};

const ReadingContext = createContext<Ctx | null>(null);
const KEY = "gr-concept-reading-v2";

// Starting point comes straight from Rich's real shelves in lib/data.ts.
const initialShelves: Record<string, Shelf> = Object.fromEntries(
  Object.values(books).map((b) => [b.slug, b.shelf ?? null])
);
const initialLogs: Record<string, Log> = Object.fromEntries(
  Object.values(books)
    .filter((b) => b.shelf)
    .map((b) => [
      b.slug,
      {
        slug: b.slug,
        page: b.shelf === "read" ? b.pages : b.page ?? 0,
        status: b.shelf === "read" ? "finished" : b.shelf === "dnf" ? "dnf" : "reading",
        rating: b.myRating ?? 0,
        note: "",
      } satisfies Log,
    ])
);

const blankLog = (slug: string): Log => ({ slug, page: 0, status: "reading", rating: 0, note: "" });

// Keeps progress, ratings and shelves for every book in one place,
// so the log sheet, home page, book pages and My books all stay in step.
export function ReadingProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState(initialLogs);
  const [shelves, setShelves] = useState(initialShelves);
  const [open, setOpen] = useState<{ slug: string; status?: Status } | null>(null);

  // Restore whatever this reader changed last time (browser only).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        // Read after mount so the server and browser render the same first frame.
        /* eslint-disable react-hooks/set-state-in-effect */
        const saved = JSON.parse(raw);
        if (saved.logs) setLogs((l) => ({ ...l, ...saved.logs }));
        if (saved.shelves) setShelves((s) => ({ ...s, ...saved.shelves }));
        /* eslint-enable react-hooks/set-state-in-effect */
      }
    } catch {}
  }, []);

  const persist = (nextLogs: Record<string, Log>, nextShelves: Record<string, Shelf>) => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ logs: nextLogs, shelves: nextShelves }));
    } catch {}
  };

  const saveLog = useCallback(
    (next: Log) => {
      const shelf: Shelf = next.status === "finished" ? "read" : next.status === "dnf" ? "dnf" : "reading";
      const nextLogs = { ...logs, [next.slug]: next };
      const nextShelves = { ...shelves, [next.slug]: shelf };
      setLogs(nextLogs);
      setShelves(nextShelves);
      persist(nextLogs, nextShelves);
    },
    [logs, shelves]
  );

  const setShelf = useCallback(
    (slug: string, shelf: Shelf) => {
      const nextShelves = { ...shelves, [slug]: shelf };
      setShelves(nextShelves);
      persist(logs, nextShelves);
    },
    [shelves, logs]
  );

  const value = useMemo<Ctx>(
    () => ({
      logOf: (slug) => logs[slug] ?? blankLog(slug),
      saveLog,
      openLog: (slug, status) => setOpen({ slug, status }),
      shelfOf: (slug) => shelves[slug] ?? null,
      setShelf,
      onShelf: (shelf) => Object.keys(shelves).filter((s) => shelves[s] === shelf),
    }),
    [logs, shelves, saveLog, setShelf]
  );

  return (
    <ReadingContext.Provider value={value}>
      {children}
      {open && (
        <LogSheet
          key={open.slug}
          slug={open.slug}
          initial={{ ...(logs[open.slug] ?? blankLog(open.slug)), ...(open.status && { status: open.status }) }}
          onClose={() => setOpen(null)}
          onSave={(next) => {
            saveLog(next);
            setOpen(null);
          }}
        />
      )}
    </ReadingContext.Provider>
  );
}

export function useReading() {
  const ctx = useContext(ReadingContext);
  if (!ctx) throw new Error("useReading must be used inside ReadingProvider");
  return ctx;
}

/** Live stats for the Read shelf. Updates as soon as a book is logged. */
export function useSummary() {
  const { onShelf, logOf } = useReading();
  return useMemo(() => summarise(onShelf("read"), (slug) => logOf(slug).rating), [onShelf, logOf]);
}
