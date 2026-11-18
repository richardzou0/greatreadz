"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon, ChevronDownIcon } from "../Icons";
import { useReading, type Shelf } from "../ReadingProvider";

const OPTIONS: { key: Exclude<Shelf, null>; label: string }[] = [
  { key: "want", label: "Want to read" },
  { key: "reading", label: "Reading" },
  { key: "read", label: "Read" },
  { key: "dnf", label: "Didn’t finish" },
];

/** The big shelf button with a dropdown, plus "Rate or log it". */
export function BookActions({ slug }: { slug: string }) {
  const { shelfOf, setShelf, openLog } = useReading();
  const shelf = shelfOf(slug);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const current = OPTIONS.find((o) => o.key === shelf);

  return (
    <div className="flex gap-2.5 lg:flex-col lg:gap-3.5">
      <div ref={ref} className="relative flex-1">
        <div className="flex h-12 overflow-hidden rounded-full bg-accent text-[15px] font-semibold text-on-accent lg:h-[50px]">
          <button
            onClick={() => (shelf ? setOpen(true) : setShelf(slug, "want"))}
            className="flex flex-1 items-center justify-center gap-2 pl-6 transition-colors hover:brightness-110"
          >
            {current && <CheckIcon size={16} />}
            {current ? current.label : "Want to read"}
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Choose a shelf"
            aria-expanded={open}
            className="flex w-14 items-center justify-center pr-2"
          >
            <ChevronDownIcon size={18} className={`transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        </div>
        {open && (
          <ul className="animate-fade-in absolute inset-x-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-2xl border border-line bg-surface p-1.5 shadow-modal">
            {OPTIONS.map((o) => (
              <li key={o.key}>
                <button
                  onClick={() => {
                    setShelf(slug, o.key);
                    setOpen(false);
                  }}
                  className="flex h-11 w-full items-center justify-between rounded-xl px-3.5 text-left text-[14px] font-medium hover:bg-accent-soft"
                >
                  {o.label}
                  {shelf === o.key && <CheckIcon size={16} className="text-accent" />}
                </button>
              </li>
            ))}
            {shelf && (
              <li className="mt-1 border-t border-line pt-1">
                <button
                  onClick={() => {
                    setShelf(slug, null);
                    setOpen(false);
                  }}
                  className="flex h-11 w-full items-center rounded-xl px-3.5 text-left text-[14px] text-muted hover:bg-accent-soft"
                >
                  Remove from shelves
                </button>
              </li>
            )}
          </ul>
        )}
      </div>
      <button
        onClick={() => openLog(slug)}
        className="h-12 rounded-full border border-line px-5 text-[15px] font-semibold transition-colors hover:bg-surface lg:h-[50px]"
      >
        <span className="lg:hidden">Log</span>
        <span className="hidden lg:inline">Rate or log it</span>
      </button>
    </div>
  );
}
