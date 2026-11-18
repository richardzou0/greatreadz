"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  achievement,
  challenge,
  challengeFriends,
  challengeRank,
  favouriteAuthor,
  formatPages,
  getBook,
  readingTaste,
  shelves,
  stats,
  type ShelfKey,
} from "@/lib/data";
import { BookCover } from "../BookCover";
import { BadgeIcon, StarSmall } from "../Icons";
import { ProgressBar } from "../ProgressBar";
import { useReading } from "../ReadingProvider";
import { ThemeToggle } from "../ThemeToggle";
import { Eyebrow, PageTitle } from "../ui";

const ordinal = (n: number) => `${n}${["th", "st", "nd", "rd"][n % 10 > 3 || [11, 12, 13].includes(n % 100) ? 0 : n % 10]}`;

// My books: shelves plus a year-in-reading view. Every number comes from the Read shelf.
export function MyBooksView() {
  const params = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const { onShelf } = useReading();
  const fromUrl = params.get("shelf") as ShelfKey | null;
  const shelf: ShelfKey = shelves.some((s) => s.key === fromUrl) ? fromUrl! : "read";

  const pick = (key: ShelfKey) => router.replace(key === "read" ? path : `${path}?shelf=${key}`, { scroll: false });

  return (
    <main className="mx-auto max-w-[1216px] pb-12 pt-14 lg:px-12 lg:pt-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="px-5 lg:px-0">
          <PageTitle right={<ThemeToggle className="lg:hidden" />}>My books</PageTitle>
        </div>
        <div role="tablist" aria-label="Shelves" className="no-scrollbar flex gap-2 overflow-x-auto px-5 lg:px-0">
          {shelves.map((s) => (
            <button
              key={s.key}
              role="tab"
              aria-selected={shelf === s.key}
              onClick={() => pick(s.key)}
              className={`flex h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-[14px] font-semibold transition-colors ${
                shelf === s.key ? "border-accent bg-accent text-on-accent" : "border-line bg-surface hover:border-accent/50"
              }`}
            >
              {s.label}
              <span className={`font-medium ${shelf === s.key ? "opacity-80" : "text-muted"}`}>{onShelf(s.key).length}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 lg:px-0">{shelf === "read" ? <ReadShelf /> : <ShelfGrid shelf={shelf} />}</div>
    </main>
  );
}

function ShelfGrid({ shelf }: { shelf: ShelfKey }) {
  const { onShelf, logOf } = useReading();
  const slugs = onShelf(shelf);
  const label = shelves.find((s) => s.key === shelf)?.label;
  const note = {
    reading: "Pick up where you left off",
    want: "The rest of Red Rising, then all of A Song of Ice and Fire",
    dnf: "No guilt. Life's too short.",
    read: "",
  }[shelf];

  return (
    <section className="animate-fade-in mt-6 lg:mt-8">
      <h2 className="font-serif text-[22px] font-medium lg:text-[26px]">{label}</h2>
      <p className="mt-0.5 text-[13px] text-muted">{slugs.length ? note : ""}</p>
      {slugs.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-line p-6 text-[14px] text-muted">
          {shelf === "dnf" ? "You've finished everything you started. Impressive." : "Nothing here yet."}
        </p>
      ) : (
        <ul className="mt-4 grid grid-cols-3 gap-3.5 sm:grid-cols-4 lg:grid-cols-6 lg:gap-[18px]">
          {slugs.map((slug) => {
            const b = getBook(slug);
            const l = logOf(slug);
            return (
              <li key={slug}>
                <BookCover slug={slug} size="sm" />
                <p className="mt-2 truncate text-[13px] font-semibold">{b.title}</p>
                <p className="truncate text-[12px] text-muted">{b.series ?? b.author}</p>
                {shelf === "reading" && <ProgressBar value={(l.page / b.pages) * 100} height={4} className="mt-2" />}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function ReadShelf() {
  const { onShelf, logOf } = useReading();
  const [showAll, setShowAll] = useState(false);
  const readSlugs = onShelf("read");
  const byPages = [...readSlugs].sort((a, b) => getBook(b).pages - getBook(a).pages);
  const maxPages = getBook(byPages[0])?.pages ?? 1;
  const challengePct = (challenge.read / challenge.goal) * 100;
  const challengeLine = `${challenge.read} of ${challenge.goal} · ${ordinal(challengeRank)} of ${challengeFriends.length} friends`;
  const tags = [
    `${favouriteAuthor.count} by ${favouriteAuthor.name}`,
    `Avg ${stats.avgPages} pages`,
    `${readSlugs.filter((s) => getBook(s).series?.includes("novella")).length} novellas`,
  ];

  return (
    <div className="animate-fade-in">
      <h2 className="mt-4 hidden font-serif text-[26px] font-medium lg:mt-6 lg:block">Your 2026 in reading</h2>

      {/* Phone: one summary card */}
      <div className="mt-4 rounded-[20px] border border-line bg-surface p-[18px] lg:hidden">
        <h2 className="font-serif text-[21px] font-medium">Your 2026 in reading</h2>
        <dl className="mt-3 grid grid-cols-3">
          {[
            [`${stats.booksRead}`, "books"],
            [formatPages(stats.pages), "pages"],
            [stats.avgRating.toFixed(1), "avg rating"],
          ].map(([v, l]) => (
            <div key={l}>
              <dt className="sr-only">{l}</dt>
              <dd className="font-serif text-[28px] font-medium leading-none">{v}</dd>
              <dd className="mt-1.5 text-[11px] text-muted">{l}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 flex justify-between text-[12px]">
          <span className="font-semibold">Reading challenge</span>
          <span className="text-muted">{challengeLine}</span>
        </p>
        <ProgressBar value={challengePct} className="mt-2" />
        <p className="mt-5 flex justify-between text-[12px]">
          <span className="font-semibold">Moods you read</span>
          <span className="text-muted">{tags[0]}</span>
        </p>
        <TasteBar className="mt-2" />
        <TasteLegend className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]" />
      </div>

      {/* Desktop: stat tiles */}
      <dl className="mt-4 hidden grid-cols-4 gap-4 lg:grid">
        {[
          [`${stats.booksRead}`, "books read"],
          [formatPages(stats.pages), "pages turned"],
          [stats.avgRating.toFixed(1), "average rating"],
        ].map(([v, l]) => (
          <div key={l} className="rounded-[20px] border border-line bg-surface p-5">
            <dd className="font-serif text-[40px] font-medium leading-none">{v}</dd>
            <dt className="mt-3 text-[13px] text-muted">{l}</dt>
          </div>
        ))}
        <div className="rounded-[20px] bg-accent-soft p-5">
          <dd className="font-serif text-[40px] font-medium leading-none">{Math.round(challengePct)}%</dd>
          <dt className="mt-3 text-[13px] text-muted">{challengeLine}</dt>
          <ProgressBar value={challengePct} height={5} className="mt-3" />
        </div>
      </dl>

      <div className="mt-6 hidden gap-4 lg:grid lg:grid-cols-[minmax(0,672fr)_minmax(0,432fr)]">
        <section className="rounded-[20px] border border-line bg-surface p-6">
          <div className="flex items-baseline justify-between">
            <Eyebrow>Pages per book</Eyebrow>
            <span className="text-[12px] text-muted">{formatPages(stats.pages)} pages in total</span>
          </div>
          <ul className="mt-4 space-y-2.5">
            {byPages.map((slug) => {
              const b = getBook(slug);
              return (
                <li key={slug} className="grid grid-cols-[150px_minmax(0,1fr)_36px] items-center gap-3 text-[13px]">
                  <span className="truncate" title={b.title}>
                    {b.title}
                  </span>
                  <ProgressBar value={(b.pages / maxPages) * 100} height={10} track="transparent" />
                  <span className="text-right tabular-nums text-muted">{b.pages}</span>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-[20px] border border-line bg-surface p-6">
          <Eyebrow>Your reading taste</Eyebrow>
          <TasteBar className="mt-4" />
          <TasteLegend className="mt-4 space-y-2.5 text-[14px]" />
          <ul className="mt-5 flex flex-wrap gap-2 border-t border-line pt-5">
            {tags.map((t) => (
              <li key={t} className="rounded-full bg-accent-soft px-3 py-1.5 text-[13px] font-semibold text-accent">
                {t}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-4 grid gap-4 lg:mt-7 lg:grid-cols-[minmax(0,553fr)_minmax(0,551fr)]">
        <section className="hidden rounded-[20px] border border-line bg-surface p-6 lg:block">
          <Eyebrow>Challenge with friends</Eyebrow>
          <ol className="mt-3 space-y-3">
            {challengeFriends.map((f, i) => (
              <li key={f.name} className="flex items-center gap-4 text-[14px]">
                <span className="w-3 font-semibold">{i + 1}</span>
                <span className={`w-14 ${f.you ? "font-semibold" : ""}`}>{f.name}</span>
                <ProgressBar
                  value={(f.read / challenge.goal) * 100}
                  height={8}
                  className="flex-1"
                  fill={f.you ? "var(--accent)" : "var(--taste-3)"}
                />
                <span className="w-14 whitespace-nowrap text-right tabular-nums text-muted">
                  {f.read} / {challenge.goal}
                </span>
              </li>
            ))}
          </ol>
        </section>

        {achievement && <Achievement title={achievement.title} text={achievement.text} />}
      </div>

      <section className="mt-6 lg:mt-9" aria-labelledby="finished">
        <div className="flex items-baseline justify-between">
          <Eyebrow>
            <span id="finished">Finished</span>
          </Eyebrow>
          <span className="text-[12px] text-muted">In the order you read them</span>
        </div>
        <ol className="mt-1 lg:mt-2">
          {readSlugs.map((slug, i) => {
            const book = getBook(slug);
            return (
              <li key={slug} className={`border-b border-line ${i > 3 && !showAll ? "hidden lg:block" : ""}`}>
                <Link href={`/book/${slug}`} className="flex items-center gap-4 py-3.5 lg:gap-6 lg:py-4">
                  <span className="w-6 shrink-0 text-center font-serif text-[20px] font-medium text-muted lg:w-9 lg:text-[24px]">{i + 1}</span>
                  <BookCover slug={slug} href={null} plain className="w-10 shrink-0 lg:w-11" />
                  <span className="min-w-0 flex-1 lg:w-[340px] lg:flex-none">
                    <span className="block truncate font-serif text-[18px] font-medium lg:text-[19px]">{book.title}</span>
                    <span className="block text-[12px] text-muted lg:text-[13px]">{book.author}</span>
                  </span>
                  <span className="hidden flex-1 text-[14px] text-muted lg:block">
                    {book.series ?? `${book.pages} pages`} · {book.year}
                  </span>
                  <span className="flex items-center gap-1 text-[13px] font-semibold lg:text-[14px]">
                    <StarSmall size={12} className="text-accent" />
                    {logOf(slug).rating}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
        {readSlugs.length > 4 && !showAll && (
          <button onClick={() => setShowAll(true)} className="mt-3 h-11 text-[14px] font-semibold text-accent lg:hidden">
            See all {readSlugs.length}
          </button>
        )}
      </section>
    </div>
  );
}

function TasteBar({ className = "" }: { className?: string }) {
  return (
    <div className={`flex h-3 gap-[3px] overflow-hidden ${className}`}>
      {readingTaste.map((t) => (
        <span key={t.label} className="rounded-[3px]" style={{ flexBasis: `${t.pct}%`, background: t.color }} />
      ))}
    </div>
  );
}

function TasteLegend({ className = "" }: { className?: string }) {
  return (
    <ul className={className}>
      {readingTaste.map((t) => (
        <li key={t.label} className="flex items-center gap-2 text-muted">
          <span className="h-3 w-3 shrink-0 rounded-[3px]" style={{ background: t.color }} />
          <span>
            <span className="text-ink lg:text-muted">{t.label}</span> · {t.pct}%
          </span>
        </li>
      ))}
    </ul>
  );
}

function Achievement({ title, text }: { title: string; text: string }) {
  const [shared, setShared] = useState(false);
  return (
    <section className="flex items-center gap-4 rounded-[20px] bg-accent-soft p-4 lg:block lg:p-6">
      <Eyebrow as="p" className="hidden text-accent lg:block">
        Achievements
      </Eyebrow>
      <div className="flex flex-1 items-center gap-4 lg:mt-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent lg:h-[52px] lg:w-[52px]">
          <BadgeIcon size={22} />
        </span>
        <div>
          <p className="text-[14px] font-semibold lg:font-serif lg:text-[22px] lg:font-medium">{title}</p>
          <p className="text-[12px] text-muted lg:text-[14px]">{text}</p>
        </div>
      </div>
      <div className="flex gap-2.5 lg:mt-5">
        <button
          onClick={() => setShared(true)}
          className="h-11 shrink-0 rounded-full border border-accent px-4 text-[13px] font-semibold text-accent transition-colors lg:bg-accent lg:px-5 lg:text-[14px] lg:text-on-accent"
        >
          <span className="lg:hidden">{shared ? "Shared ✓" : "Share"}</span>
          <span className="hidden lg:inline">{shared ? "Link copied ✓" : "Share your year so far"}</span>
        </button>
        <button className="hidden h-11 rounded-full border border-accent px-5 text-[14px] font-semibold text-accent lg:block">See all badges</button>
      </div>
    </section>
  );
}
