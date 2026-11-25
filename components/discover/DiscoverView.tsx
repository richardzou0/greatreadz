"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { books, booksByGenre, discoverPicks, genres, getBook, lovedCount, moods, paceOf, paces, topMood } from "@/lib/data";
import { BookCover } from "../BookCover";
import { ChevronRightIcon, FlagIcon, ListIcon, PeopleIcon, ScanIcon, SearchIcon } from "../Icons";
import { useReading } from "../ReadingProvider";
import { ShelfReveal } from "../ShelfReveal";
import { ScanSheet } from "./ScanSheet";
import { ShelfBook } from "../ShelfBook";
import { ThemeToggle } from "../ThemeToggle";
import { Eyebrow, PageTitle } from "../ui";

const COMMUNITY = [
  { Icon: PeopleIcon, title: "Westeros Readalong", text: "Starting A Game of Thrones this week · Maya and Lena are in", short: "Starting A Game of Thrones · 31 posts", href: "/community#clubs" },
  { Icon: ListIcon, title: "What friends are reading", text: "Maya started A Game of Thrones, Jonah finished The Poppy War, and 6 more updates", href: "/community" },
  { Icon: FlagIcon, title: "2026 reading challenge", text: "See how your friends are pacing toward their goals", href: "/community" },
];

// Discover: one search box, browse by how you want to feel, community out in the open.
export function DiscoverView() {
  const params = useSearchParams();
  const startMood = params.get("mood");
  const [mood, setMood] = useState(startMood && moods.includes(startMood) ? startMood : topMood);
  const [pace, setPace] = useState("Fast");
  const [genre, setGenre] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [query, setQuery] = useState("");

  // Books with the mood at your pace. If none fit, show the mood at any pace.
  const { picks, anyPace } = useMemo(() => {
    const withMood = discoverPicks.filter((p) => getBook(p.slug).moods.includes(mood));
    const atPace = withMood.filter((p) => paceOf(getBook(p.slug)) === pace);
    return atPace.length ? { picks: atPace.slice(0, 6), anyPace: false } : { picks: withMood.slice(0, 6), anyPace: true };
  }, [mood, pace]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return Object.values(books)
      .filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
  }, [query]);

  return (
    <main className="mx-auto max-w-[1216px] px-5 pb-12 pt-14 lg:px-12 lg:pt-10">
      <PageTitle right={<ThemeToggle className="lg:hidden" />}>Discover</PageTitle>

      {/* The one search */}
      <div className="relative mt-4 max-w-[720px] lg:mt-6">
        <div className="flex h-[50px] items-center gap-3 rounded-full border border-line bg-surface pl-[18px] pr-1 focus-within:border-accent lg:h-14 lg:pl-5 lg:pr-1.5">
          <SearchIcon size={20} className="shrink-0 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search books, authors, friends and clubs"
            aria-label="Search books, authors, friends and clubs"
            className="h-full min-w-0 flex-1 bg-transparent text-[14px] placeholder:text-muted focus:outline-none lg:text-[16px]"
          />
          <button
            aria-label="Scan a barcode"
            onClick={() => setScanning(true)}
            className="flex h-[42px] shrink-0 items-center gap-2 rounded-full bg-accent-soft px-[11px] text-[14px] font-semibold text-accent transition-transform active:scale-95 lg:h-11 lg:px-4"
          >
            <ScanIcon size={20} />
            <span className="hidden lg:inline">Scan</span>
          </button>
        </div>
        {query && (
          <ul className="animate-fade-in absolute inset-x-0 top-[calc(100%+6px)] z-30 max-h-[min(420px,60dvh)] overflow-y-auto rounded-2xl border border-line bg-surface p-1.5 shadow-modal">
            {results.length === 0 && <li className="px-4 py-3 text-[14px] text-muted">No books match “{query}”. Try an author.</li>}
            {results.map((b) => (
              <li key={b.slug}>
                <Link href={`/book/${b.slug}`} className="flex items-center gap-3 rounded-xl p-2 hover:bg-accent-soft">
                  <BookCover slug={b.slug} href={null} size="sm" className="w-8 shrink-0" />
                  <span>
                    <span className="block font-serif text-[16px] font-medium">{b.title}</span>
                    <span className="block text-[12px] text-muted">{b.author}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Eyebrow className="mt-6 lg:mt-11">I&apos;m in the mood for</Eyebrow>
      <div role="radiogroup" aria-label="Mood" className="mt-2.5 grid grid-cols-3 gap-2 lg:mt-3.5 lg:grid-cols-6 lg:gap-3">
        {moods.map((m) => (
          <button
            key={m}
            role="radio"
            aria-checked={mood === m}
            onClick={() => setMood(m)}
            className={`h-[46px] rounded-[14px] border text-[14px] font-semibold transition-all active:scale-[0.97] lg:h-[60px] lg:px-5 lg:text-left lg:text-[16px] ${
              mood === m ? "border-accent bg-accent text-on-accent" : "border-line bg-surface hover:border-accent/50"
            } text-center`}
          >
            {m}
          </button>
        ))}
      </div>

      <Eyebrow className="mt-5 lg:mt-10">Pace</Eyebrow>
      <div role="radiogroup" aria-label="Pace" className="relative mt-2.5 grid w-full grid-cols-3 rounded-full border border-line bg-surface p-1 lg:mt-3.5 lg:w-[430px]">
        <span
          aria-hidden
          className="absolute bottom-1 left-1 top-1 rounded-full bg-accent transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ width: "calc((100% - 8px) / 3)", transform: `translateX(${paces.indexOf(pace) * 100}%)` }}
        />
        {paces.map((p) => (
          <button
            key={p}
            role="radio"
            aria-checked={pace === p}
            onClick={() => setPace(p)}
            className={`relative z-10 h-11 rounded-full text-[14px] font-semibold transition-colors ${pace === p ? "text-on-accent" : "text-muted hover:text-ink"}`}
          >
            {p}
          </button>
        ))}
      </div>

      <section className="mt-5 lg:mt-10" aria-live="polite">
        <h2 className="font-serif text-[22px] font-medium lg:text-[26px]">
          {mood}, {anyPace ? "any pace" : `${pace.toLowerCase()}-paced`} picks
        </h2>
        <p className="mt-0.5 text-[12px] text-muted lg:text-[14px]">
          <span className="lg:hidden">
            {anyPace ? `Nothing ${pace.toLowerCase()}-paced fits, so here's any pace. ` : ""}Matched to books you rated 4+, not what&apos;s trending
          </span>
          <span className="hidden lg:inline">
            {anyPace ? `Nothing ${pace.toLowerCase()}-paced fits, so here's any pace. ` : ""}Matched to the {lovedCount} books you rated 4 stars or higher, not to what&apos;s trending
          </span>
        </p>
        {picks.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-line p-6 text-[14px] text-muted">
            Nothing {mood.toLowerCase()} on your radar yet. Try another mood or rate a few more books.
          </p>
        ) : (
          <ShelfReveal
            replayKey="discover"
            className="no-scrollbar -mx-5 mt-3 flex gap-3 overflow-x-auto px-5 lg:mx-0 lg:mt-4 lg:grid lg:max-w-[960px] lg:grid-cols-6 lg:gap-[18px] lg:overflow-visible lg:px-0"
          >
            {picks.map((p) => (
              <li key={p.slug} data-shelf-item className="w-[80px] shrink-0 lg:w-auto">
                <ShelfBook slug={p.slug} size="sm" />
                <p data-shelf-caption className="mt-2 text-[11px] font-semibold text-accent lg:mt-3 lg:text-[13px]">
                  {p.match}% match
                </p>
              </li>
            ))}
          </ShelfReveal>
        )}
      </section>

      <section className="mt-8 lg:mt-10">
        <Eyebrow>Genres</Eyebrow>
        <ul className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:mt-3.5 lg:flex-wrap lg:gap-2.5 lg:overflow-visible lg:px-0">
          {genres.map((g) => (
            <li key={g} className="shrink-0">
              <button
                onClick={() => setGenre(genre === g ? null : g)}
                aria-pressed={genre === g}
                className={`h-11 rounded-full border px-[18px] text-[14px] transition-colors ${
                  genre === g ? "border-accent bg-accent-soft font-semibold text-accent" : "border-line bg-surface hover:border-accent/50"
                }`}
              >
                {g}
              </button>
            </li>
          ))}
        </ul>
        {genre && <GenreBooks genre={genre} />}
      </section>

      <section className="mt-6 lg:mt-10">
        <div className="flex items-center justify-between">
          <Eyebrow>Your community</Eyebrow>
          <Link href="/community" className="flex h-9 items-center gap-1 text-[13px] font-semibold text-accent">
            Open Community
            <ChevronRightIcon size={14} />
          </Link>
        </div>
        {/* Phone: the one thing happening now */}
        <Link href="/community#clubs" className="mt-2.5 flex items-center gap-3.5 rounded-2xl border border-line bg-surface p-3.5 lg:hidden">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
            <PeopleIcon size={20} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-semibold">{COMMUNITY[0].title}</span>
            <span className="block text-[13px] text-muted">{COMMUNITY[0].short}</span>
          </span>
          <ChevronRightIcon size={18} className="text-muted" />
        </Link>
        {/* Desktop: all three */}
        <ul className="mt-3.5 hidden grid-cols-3 gap-4 lg:grid xl:max-w-[836px]">
          {COMMUNITY.map(({ Icon, title, text, href }) => (
            <li key={title}>
              <Link
                href={href}
                className="block h-full rounded-[20px] border border-line bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-accent/40"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Icon size={20} />
                </span>
                <span className="mt-4 block text-[16px] font-semibold">{title}</span>
                <span className="mt-2 block text-[14px] leading-[1.5] text-muted">{text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      {scanning && <ScanSheet onClose={() => setScanning(false)} />}
    </main>
  );
}

/** Books in a genre: ones you haven't read first, each marked with its shelf if it has one. */
function GenreBooks({ genre }: { genre: string }) {
  const { shelfOf } = useReading();
  const label: Record<string, string> = { want: "On Want to read", reading: "Reading", read: "Read", dnf: "Didn’t finish" };
  const slugs = [...booksByGenre[genre]].sort((a, b) => Number(shelfOf(a) === "read") - Number(shelfOf(b) === "read"));
  return (
    <ul key={genre} className="no-scrollbar animate-fade-in -mx-5 mt-4 flex gap-3 overflow-x-auto px-5 pb-1 lg:mx-0 lg:grid lg:grid-cols-6 lg:gap-[18px] lg:overflow-visible lg:px-0">
      {slugs.map((slug) => {
        const shelf = shelfOf(slug);
        return (
          <li key={slug} className="w-[96px] shrink-0 lg:w-auto">
            <BookCover slug={slug} size="sm" />
            <p className="mt-2 truncate text-[13px] font-semibold">{getBook(slug).title}</p>
            <p className={`truncate text-[12px] ${shelf ? "text-accent" : "text-muted"}`}>{shelf ? label[shelf] : getBook(slug).author}</p>
          </li>
        );
      })}
    </ul>
  );
}
