"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { currentlyReading } from "@/lib/data";
import { LogSheet } from "./LogSheet";

export type Status = "reading" | "finished" | "dnf";
export type Shelf = "want" | "reading" | "read" | "dnf" | null;

type Log = { slug: string; page: number; status: Status; rating: number; note: string };

type Ctx = {
  log: Log;
  saveLog: (next: Log) => void;
  openLog: (slug?: string, status?: Status) => void;
  shelfOf: (slug: string) => Shelf;
  setShelf: (slug: string, shelf: Shelf) => void;
};

const ReadingContext = createContext<Ctx | null>(null);
const KEY = "gr-concept-reading";

const initialLog: Log = { slug: currentlyReading.slug, page: currentlyReading.page, status: "reading", rating: 4.25, note: "" };

// Keeps the "currently reading" log and shelf choices in one place,
// so the log sheet, home page and book page all stay in step.
export function ReadingProvider({ children }: { children: React.ReactNode }) {
  const [log, setLog] = useState<Log>(initialLog);
  const [shelves, setShelves] = useState<Record<string, Shelf>>({ middlemarch: "reading" });
  const [openFor, setOpenFor] = useState<string | null>(null);
  const [presetStatus, setPresetStatus] = useState<Status | null>(null);

  // Restore whatever this reader saved last time (browser only).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        // Read after mount so the server and browser render the same first frame.
        /* eslint-disable react-hooks/set-state-in-effect */
        const saved = JSON.parse(raw);
        if (saved.log) setLog(saved.log);
        if (saved.shelves) setShelves(saved.shelves);
        /* eslint-enable react-hooks/set-state-in-effect */
      }
    } catch {}
  }, []);

  const persist = (nextLog: Log, nextShelves: Record<string, Shelf>) => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ log: nextLog, shelves: nextShelves }));
    } catch {}
  };

  const saveLog = useCallback(
    (next: Log) => {
      const shelf: Shelf = next.status === "finished" ? "read" : next.status === "dnf" ? "dnf" : "reading";
      const nextShelves = { ...shelves, [next.slug]: shelf };
      setLog(next);
      setShelves(nextShelves);
      persist(next, nextShelves);
    },
    [shelves]
  );

  const setShelf = useCallback(
    (slug: string, shelf: Shelf) => {
      const nextShelves = { ...shelves, [slug]: shelf };
      setShelves(nextShelves);
      persist(log, nextShelves);
    },
    [shelves, log]
  );

  const value: Ctx = {
    log,
    saveLog,
    openLog: (slug, status) => {
      setPresetStatus(status ?? null);
      setOpenFor(slug ?? log.slug);
    },
    shelfOf: (slug) => shelves[slug] ?? null,
    setShelf,
  };

  return (
    <ReadingContext.Provider value={value}>
      {children}
      {openFor && (
        <LogSheet
          key={openFor}
          slug={openFor}
          initial={{
            ...(openFor === log.slug ? log : { ...initialLog, slug: openFor, page: 0, rating: 0 }),
            ...(presetStatus && { status: presetStatus }),
          }}
          onClose={() => setOpenFor(null)}
          onSave={(next) => {
            saveLog(next);
            setOpenFor(null);
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
