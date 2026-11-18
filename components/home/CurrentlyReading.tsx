"use client";

import Link from "next/link";
import { getBook } from "@/lib/data";
import { BookCover } from "../BookCover";
import { SyncIcon } from "../Icons";
import { ProgressBar } from "../ProgressBar";
import { useReading } from "../ReadingProvider";

export function CurrentlyReading() {
  const { log, openLog } = useReading();
  const book = getBook(log.slug);
  if (!book) return null;
  const pct = Math.round((log.page / book.pages) * 100);
  const done = log.status === "finished";

  return (
    <div className="flex gap-4 rounded-[20px] border border-line bg-surface p-4 lg:gap-7 lg:p-6">
      <BookCover slug={book.slug} fullAuthor className="w-[76px] shrink-0 lg:w-[120px]" />
      <div className="min-w-0 flex-1 lg:pt-1">
        <Link href={`/book/${book.slug}`} className="font-serif text-[21px] font-medium leading-tight hover:underline lg:text-[30px]">
          {book.title}
        </Link>
        <p className="mt-1 text-[13px] text-muted lg:mt-2 lg:text-[15px]">{book.author}</p>
        <ProgressBar value={done ? 100 : pct} className="mt-3 lg:mt-5" height={6} label={`${pct}% read`} />
        <p className="mt-2 flex items-center gap-1.5 text-[12px] text-muted lg:mt-3 lg:text-[14px]">
          <SyncIcon size={13} className="lg:hidden" />
          <span className="lg:hidden">
            p. {log.page} of {book.pages} · synced from Kindle
          </span>
          <span className="hidden lg:inline">
            Page {log.page} of {book.pages} · {pct}% · synced from Kindle 2 hours ago
          </span>
        </p>
        <div className="mt-3 flex flex-wrap gap-2.5 lg:mt-4">
          <button
            onClick={() => openLog(book.slug)}
            className="h-11 rounded-full bg-accent px-[18px] text-[14px] font-semibold text-on-accent transition-transform hover:scale-[1.03] active:scale-[0.98] lg:px-5"
          >
            Update progress
          </button>
          <button
            onClick={() => openLog(book.slug, "finished")}
            className="hidden h-11 rounded-full border border-line px-5 text-[14px] font-semibold transition-colors hover:bg-bg lg:block"
          >
            Mark as finished
          </button>
        </div>
      </div>
    </div>
  );
}
