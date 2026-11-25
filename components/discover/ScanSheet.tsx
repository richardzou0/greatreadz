"use client";

import Link from "next/link";
import { useState } from "react";
import { discoverPicks, getBook } from "@/lib/data";
import { BookCover } from "../BookCover";
import { CheckIcon, ScanIcon } from "../Icons";
import { useReading } from "../ReadingProvider";
import { Sheet } from "../Sheet";

/**
 * The barcode scanner, as a demo: no camera is used in this concept.
 * A demo scan "finds" one of the books picked for Rich, so the flow can be shown end to end.
 */
export function ScanSheet({ onClose }: { onClose: () => void }) {
  const { shelfOf, setShelf } = useReading();
  const [found, setFound] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  const demoScan = () => {
    setScanning(true);
    setTimeout(() => {
      const pool = discoverPicks.slice(0, 5);
      setFound(pool[Math.floor(Math.random() * pool.length)].slug);
      setScanning(false);
    }, 900);
  };

  const book = found ? getBook(found) : null;
  const wanted = found ? shelfOf(found) === "want" : false;

  return (
    <Sheet title="Scan a barcode" subtitle="Point your camera at the barcode on the back of a book" onClose={onClose}>
      {!book ? (
        <>
          <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-[#14120f]">
            <div className="relative h-[46%] w-[74%] rounded-xl border-2 border-dashed border-white/40">
              {scanning && <span className="absolute inset-x-2 top-1/2 h-0.5 animate-pulse bg-accent shadow-[0_0_12px_var(--accent)]" />}
            </div>
            <p className="absolute bottom-3 text-[12px] text-white/70">
              {scanning ? "Looking for a barcode…" : "Camera scanning isn't part of this concept"}
            </p>
          </div>
          <button
            data-autofocus
            onClick={demoScan}
            disabled={scanning}
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent text-[15px] font-semibold text-on-accent transition-transform active:scale-[0.98]"
          >
            <ScanIcon size={18} />
            {scanning ? "Scanning…" : "Try a demo scan"}
          </button>
        </>
      ) : (
        <div className="animate-fade-in">
          <div className="flex gap-4 rounded-2xl border border-line bg-surface p-4">
            <BookCover slug={book.slug} href={null} size="sm" className="w-16 shrink-0" />
            <div className="min-w-0">
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-accent">Found it</p>
              <p className="mt-1 font-serif text-[20px] font-medium leading-tight">{book.title}</p>
              <p className="text-[13px] text-muted">{book.author}</p>
            </div>
          </div>
          <div className="mt-4 flex gap-2.5">
            <button
              data-autofocus
              onClick={() => setShelf(book.slug, wanted ? null : "want")}
              className={`flex h-12 flex-1 items-center justify-center gap-1.5 rounded-full text-[14px] font-semibold transition-all active:scale-[0.98] ${
                wanted ? "bg-accent text-on-accent" : "border border-accent text-accent hover:bg-accent-soft"
              }`}
            >
              {wanted && <CheckIcon size={16} />}
              {wanted ? "On your Want to read" : "Want to read"}
            </button>
            <Link
              href={`/book/${book.slug}`}
              className="flex h-12 flex-1 items-center justify-center rounded-full bg-accent text-[14px] font-semibold text-on-accent"
            >
              Open book
            </Link>
          </div>
          <button onClick={() => setFound(null)} className="mt-3 h-11 w-full text-[14px] font-semibold text-muted hover:text-ink">
            Scan another
          </button>
        </div>
      )}
    </Sheet>
  );
}
