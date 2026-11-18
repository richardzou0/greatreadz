"use client";

import Link from "next/link";
import { getBook } from "@/lib/data";
import { BookCover } from "../BookCover";
import { ProgressBar } from "../ProgressBar";
import { useReading } from "../ReadingProvider";

export function CurrentlyReading() {
  const { logOf, openLog, onShelf } = useReading();
  const [main, ...others] = onShelf("reading");

  if (!main) {
    return (
      <div className="rounded-[20px] border border-dashed border-line p-6 text-[14px] text-muted">
        Nothing on the go. <Link href="/discover" className="font-semibold text-accent">Find your next book</Link>
      </div>
    );
  }

  const book = getBook(main);
  const log = logOf(main);
  const pct = Math.round((log.page / book.pages) * 100);

  return (
    <div className="rounded-[20px] border border-line bg-surface p-4 lg:p-6">
      <div className="flex gap-4 lg:gap-7">
        <BookCover slug={book.slug} fullAuthor className="w-[76px] shrink-0 lg:w-[120px]" />
        <div className="min-w-0 flex-1 lg:pt-1">
          <Link href={`/book/${book.slug}`} className="font-serif text-[21px] font-medium leading-tight hover:underline lg:text-[30px]">
            {book.title}
          </Link>
          <p className="mt-1 text-[13px] text-muted lg:mt-2 lg:text-[15px]">
            {book.author}
            {book.series && <span className="hidden sm:inline"> · {book.series}</span>}
          </p>
          <ProgressBar value={pct} className="mt-3 lg:mt-5" height={6} label={`${pct}% read`} />
          <p className="mt-2 text-[12px] text-muted lg:mt-3 lg:text-[14px]">
            <span className="lg:hidden">
              p. {log.page} of {book.pages} · {pct}%
            </span>
            <span className="hidden lg:inline">
              Page {log.page} of {book.pages} · {pct}% · {book.pages - log.page} pages to go
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

      {/* Anything else on the go, kept small */}
      {others.length > 0 && (
        <ul className="mt-4 border-t border-line pt-3 lg:mt-5">
          {others.map((slug) => {
            const b = getBook(slug);
            const l = logOf(slug);
            const p = Math.round((l.page / b.pages) * 100);
            return (
              <li key={slug}>
                <button onClick={() => openLog(slug)} className="flex w-full items-center gap-3 rounded-xl py-1.5 text-left hover:bg-bg">
                  <BookCover slug={slug} href={null} plain className="w-7 shrink-0" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-semibold">
                      Also reading: <span className="font-serif text-[15px] font-medium">{b.title}</span>
                    </span>
                    <ProgressBar value={p} height={4} className="mt-1.5 max-w-[240px]" />
                  </span>
                  <span className="shrink-0 text-[12px] text-muted">{p}%</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
