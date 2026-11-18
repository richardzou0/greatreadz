"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  challenge,
  challengeFriends,
  diary,
  getBook,
  pagesPerMonth,
  readingTaste,
  shelfBooks,
  shelves,
} from "@/lib/data";
import { BookCover } from "../BookCover";
import { BadgeIcon, StarSmall } from "../Icons";
import { ProgressBar } from "../ProgressBar";
import { ThemeToggle } from "../ThemeToggle";
import { Eyebrow, PageTitle } from "../ui";

type ShelfKey = (typeof shelves)[number]["key"];

// My books: shelves plus a year-in-reading view.
export function MyBooksView() {
  const params = useSearchParams();
  const router = useRouter();
  const path = usePathname();
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
              <span className={`font-medium ${shelf === s.key ? "opacity-80" : "text-muted"}`}>{s.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 lg:px-0">{shelf === "read" ? <ReadShelf /> : <ShelfGrid shelf={shelf} />}</div>
    </main>
  );
}

function ShelfGrid({ shelf }: { shelf: ShelfKey }) {
  const slugs = shelfBooks[shelf] ?? [];
  const label = shelves.find((s) => s.key === shelf)?.label;
  return (
    <section className="animate-fade-in mt-6 lg:mt-8">
      <h2 className="font-serif text-[22px] font-medium lg:text-[26px]">{label}</h2>
      <p className="mt-0.5 text-[13px] text-muted">
        {shelf === "dnf" ? "No guilt. Life's too short." : shelf === "want" ? "Showing the 6 you added most recently" : "Pick up where you left off"}
      </p>
      <ul className="mt-4 grid grid-cols-3 gap-3.5 sm:grid-cols-4 lg:grid-cols-6 lg:gap-[18px]">
        {slugs.map((slug) => (
          <li key={slug}>
            <BookCover slug={slug} size="sm" />
            <p className="mt-2 truncate text-[13px] font-semibold">{getBook(slug).title}</p>
            <p className="truncate text-[12px] text-muted">{getBook(slug).author}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ReadShelf() {
  const max = Math.max(...pagesPerMonth.map((p) => p.v));
  const challengePct = (challenge.read / challenge.goal) * 100;

  return (
    <div className="animate-fade-in">
      <h2 className="mt-4 hidden font-serif text-[26px] font-medium lg:mt-6 lg:block">Your 2026 in reading</h2>

      {/* Phone: one summary card */}
      <div className="mt-4 rounded-[20px] border border-line bg-surface p-[18px] lg:hidden">
        <h2 className="font-serif text-[21px] font-medium">Your 2026 in reading</h2>
        <dl className="mt-3 grid grid-cols-3">
          {[
            ["38", "books"],
            ["11.2k", "pages"],
            ["3.9", "avg rating"],
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
          <span className="text-muted">38 of 50 · 2nd of 5 friends</span>
        </p>
        <ProgressBar value={challengePct} className="mt-2" />
        <p className="mt-5 flex justify-between text-[12px]">
          <span className="font-semibold">Moods you read</span>
          <span className="text-muted">Mostly slow-paced</span>
        </p>
        <TasteBar className="mt-2" />
        <TasteLegend className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]" />
      </div>

      {/* Desktop: stat tiles */}
      <dl className="mt-4 hidden grid-cols-4 gap-4 lg:grid">
        {[
          ["38", "books read"],
          ["11.2k", "pages turned"],
          ["3.9", "average rating"],
        ].map(([v, l]) => (
          <div key={l} className="rounded-[20px] border border-line bg-surface p-5">
            <dd className="font-serif text-[40px] font-medium leading-none">{v}</dd>
            <dt className="mt-3 text-[13px] text-muted">{l}</dt>
          </div>
        ))}
        <div className="rounded-[20px] bg-accent-soft p-5">
          <dd className="font-serif text-[40px] font-medium leading-none">{Math.round(challengePct)}%</dd>
          <dt className="mt-3 text-[13px] text-muted">38 of 50 · 2nd of 5 friends</dt>
          <ProgressBar value={challengePct} height={5} className="mt-3" track="var(--line)" />
        </div>
      </dl>

      <div className="mt-6 hidden gap-4 lg:grid lg:grid-cols-[minmax(0,672fr)_minmax(0,432fr)]">
        <section className="rounded-[20px] border border-line bg-surface p-6">
          <Eyebrow>Pages per month</Eyebrow>
          <ul className="mt-6 flex h-[168px] items-end justify-between gap-2" aria-label="Pages read per month">
            {pagesPerMonth.map((p, i) => {
              const current = i === pagesPerMonth.length - 1;
              return (
                <li key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-3">
                  <span
                    title={`${p.v * 10} pages`}
                    className="animate-grow block w-full max-w-9 rounded-t-md rounded-b-[2px]"
                    style={{
                      height: `${(p.v / max) * 150}px`,
                      background: current ? "var(--taste-2)" : "var(--accent)",
                      animationDelay: `${i * 40}ms`,
                    }}
                  />
                  <span className="text-[11px] text-muted">{p.m}</span>
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
            {["Mostly slow-paced", "Character-driven", "Avg 412 pages"].map((t) => (
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

        <Achievement />
      </div>

      <section className="mt-6 lg:mt-9" aria-labelledby="diary">
        <Eyebrow>
          <span id="diary">Reading diary</span>
        </Eyebrow>
        <ol className="mt-1 lg:mt-2">
          {diary.map((d, i) => {
            const book = getBook(d.slug);
            return (
              <li key={d.slug} className={`border-b border-line ${i > 1 ? "hidden lg:block" : ""}`}>
                <Link href={`/book/${d.slug}`} className="flex items-center gap-4 py-3.5 lg:gap-6 lg:py-4">
                  <span className="w-9 shrink-0 text-center">
                    <span className="block text-[10px] font-semibold tracking-[0.06em] text-muted lg:text-[11px]">{d.month}</span>
                    <span className="block font-serif text-[22px] font-medium leading-none lg:text-[26px]">{d.day}</span>
                  </span>
                  <BookCover slug={d.slug} href={null} plain className="w-10 shrink-0 lg:w-11" />
                  <span className="min-w-0 flex-1 lg:w-[280px] lg:flex-none">
                    <span className="block font-serif text-[18px] font-medium lg:text-[19px]">{book.title}</span>
                    <span className="block text-[12px] text-muted lg:text-[13px]">{book.author}</span>
                  </span>
                  <span className="hidden flex-1 text-[14px] text-muted lg:block">{d.note}</span>
                  <span className="flex items-center gap-1 text-[13px] font-semibold lg:text-[14px]">
                    <StarSmall size={12} className="text-accent" />
                    {d.rating}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
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

function Achievement() {
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
          <p className="text-[14px] font-semibold lg:font-serif lg:text-[22px] lg:font-medium">Autumn Gothic unlocked</p>
          <p className="text-[12px] text-muted lg:text-[14px]">3 gothic novels before Nov 30 · limited time</p>
        </div>
      </div>
      <div className="flex gap-2.5 lg:mt-5">
        <button
          onClick={() => setShared(true)}
          className="h-11 shrink-0 rounded-full border border-accent px-4 text-[13px] font-semibold text-accent transition-colors lg:border-accent lg:bg-accent lg:px-5 lg:text-[14px] lg:text-on-accent"
        >
          <span className="lg:hidden">{shared ? "Shared ✓" : "Share"}</span>
          <span className="hidden lg:inline">{shared ? "Link copied ✓" : "Share your year so far"}</span>
        </button>
        <button className="hidden h-11 rounded-full border border-accent px-5 text-[14px] font-semibold text-accent lg:block">See all badges</button>
      </div>
    </section>
  );
}
