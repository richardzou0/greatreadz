"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { ScrollShelf } from "../ScrollShelf";
import { ShelfReveal } from "../ShelfReveal";
import { ShelfBook } from "../ShelfBook";
import { AddBooksSheet } from "./AddBooksSheet";
import { Bookcase } from "./Bookcase";
import { formatPages, getBook, shelves, type ShelfKey } from "@/lib/data";
import {
  BadgeIcon,
  BooksIcon,
  ChevronRightIcon,
  CoversIcon,
  PlusIcon,
  StarSmall,
} from "../Icons";
import { ProgressBar } from "../ProgressBar";
import { useReading, useSummary } from "../ReadingProvider";
import { ThemeToggle } from "../ThemeToggle";
import { Eyebrow, PageTitle } from "../ui";

const ordinal = (n: number) =>
  `${n}${["th", "st", "nd", "rd"][n % 10 > 3 || [11, 12, 13].includes(n % 100) ? 0 : n % 10]}`;

type Tab = ShelfKey | "stats" | "all";
type View = "covers" | "spines";

const VIEW_KEY = "gr-shelf-view";
const VIEW_EVENT = "gr-shelf-view-change";

// Covers or spines, remembered in this browser. Starts on covers.
function useShelfView() {
  const view = useSyncExternalStore(
    (onChange) => {
      window.addEventListener(VIEW_EVENT, onChange);
      return () => window.removeEventListener(VIEW_EVENT, onChange);
    },
    () => {
      try {
        return (localStorage.getItem(VIEW_KEY) as View) || "covers";
      } catch {
        return "covers";
      }
    },
    () => "covers" as View,
  );
  const setView = (next: View) => {
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {}
    window.dispatchEvent(new Event(VIEW_EVENT));
  };
  return [view, setView] as const;
}

function ViewToggle({
  view,
  onChange,
  className = "",
}: {
  view: View;
  onChange: (v: View) => void;
  className?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Show books as"
      className={`flex shrink-0 rounded-full border border-line bg-surface p-1 ${className}`}
    >
      {(["covers", "spines"] as const).map((v) => (
        <button
          key={v}
          role="radio"
          aria-checked={view === v}
          aria-label={
            v === "covers" ? "Show covers" : "Show spines, like a bookcase"
          }
          title={v === "covers" ? "Covers" : "Spines"}
          onClick={() => onChange(v)}
          className={`flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold transition-colors ${
            view === v
              ? "bg-accent text-on-accent"
              : "text-muted hover:text-ink"
          }`}
        >
          {v === "covers" ? <CoversIcon size={16} /> : <BooksIcon size={16} />}
          <span className="hidden sm:inline">
            {v === "covers" ? "Covers" : "Spines"}
          </span>
        </button>
      ))}
    </div>
  );
}

// My shelf: "All" shows every shelf at once, then a tab per shelf, then Stats.
export function MyBooksView() {
  const params = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const { onShelf } = useReading();
  const fromUrl = params.get("shelf");
  const tab: Tab =
    fromUrl === "stats"
      ? "stats"
      : shelves.some((s) => s.key === fromUrl)
        ? (fromUrl as ShelfKey)
        : "all";

  const pick = (key: Tab) =>
    router.replace(key === "all" ? path : `${path}?shelf=${key}`, {
      scroll: false,
    });
  const [view, setView] = useShelfView();
  const showToggle = tab !== "stats";
  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "all", label: "All" },
    ...shelves.map((s) => ({
      key: s.key,
      label: s.label,
      count: onShelf(s.key).length,
    })),
    { key: "stats", label: "Stats" },
  ];

  return (
    <main className="mx-auto max-w-[1216px] pb-12 pt-14 lg:px-12 lg:pt-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="px-5 lg:px-0">
          <PageTitle
            right={
              <div className="flex items-center gap-2 lg:hidden">
                {showToggle && <ViewToggle view={view} onChange={setView} />}
                <ThemeToggle />
              </div>
            }
          >
            My shelf
          </PageTitle>
        </div>
        <div className="flex items-center gap-3">
          <div
            role="tablist"
            aria-label="My shelf"
            className="no-scrollbar flex gap-2 overflow-x-auto px-5 lg:px-0"
          >
            {tabs.map((t) => (
              <button
                key={t.key}
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => pick(t.key)}
                className={`flex h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-[14px] font-semibold transition-colors ${
                  tab === t.key
                    ? "border-accent bg-accent text-on-accent"
                    : "border-line bg-surface hover:border-accent/50"
                }`}
              >
                {t.label}
                {t.count !== undefined && (
                  <span
                    className={`font-medium ${tab === t.key ? "opacity-80" : "text-muted"}`}
                  >
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>
          {showToggle && (
            <ViewToggle
              view={view}
              onChange={setView}
              className="hidden lg:flex"
            />
          )}
        </div>
      </div>

      <div className="px-5 lg:px-0">
        {tab === "all" ? (
          <MyShelf onSeeAll={pick} view={view} />
        ) : tab === "stats" ? (
          <StatsView onSeeRead={() => pick("read")} />
        ) : (
          <ShelfGrid shelf={tab} view={view} />
        )}
      </div>
    </main>
  );
}

const ADD_LABEL: Record<ShelfKey, string> = {
  want: "Add a book",
  reading: "Start a book",
  read: "Log a finished book",
  dnf: "Log a book",
};

/** The text under a book: title, then what matters for its shelf. */
function BookCaption({ slug, shelf }: { slug: string; shelf: ShelfKey }) {
  const { logOf } = useReading();
  const b = getBook(slug);
  const l = logOf(slug);
  return (
    <div data-shelf-caption>
      <p className="mt-3 truncate text-[13px] font-semibold">{b.title}</p>
      <p className="truncate text-[12px] text-muted">
        {shelf === "read" ? b.author : (b.series ?? b.author)}
      </p>
      {shelf === "read" && l.rating > 0 && (
        <p className="mt-1 flex items-center gap-1 text-[12px] font-semibold">
          <StarSmall size={11} className="text-accent" />
          {l.rating}
        </p>
      )}
      {shelf === "reading" && (
        <ProgressBar
          value={(l.page / b.pages) * 100}
          height={4}
          className="mt-2"
        />
      )}
      {shelf === "dnf" && (
        <p className="mt-1 text-[12px] text-muted">
          Stopped at {Math.round((l.page / b.pages) * 100)}%
        </p>
      )}
    </div>
  );
}

function AddTile({ shelf, onClick }: { shelf: ShelfKey; onClick: () => void }) {
  return (
    <button
      data-shelf-cover
      data-spine={0.05}
      onClick={onClick}
      className="group flex aspect-[2/3] w-full flex-col items-center justify-center gap-3 rounded-[6px] border-2 border-dashed border-line text-muted transition-colors hover:border-accent hover:bg-accent-soft hover:text-accent"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface transition-transform group-hover:scale-110">
        <PlusIcon size={22} />
      </span>
      <span className="px-3 text-center text-[13px] font-semibold">
        {ADD_LABEL[shelf]}
      </span>
    </button>
  );
}

// Every shelf at once, each as its own sideways-scrolling row on a ledge.
function MyShelf({
  onSeeAll,
  view,
}: {
  onSeeAll: (shelf: ShelfKey) => void;
  view: View;
}) {
  const { onShelf } = useReading();
  const [adding, setAdding] = useState<ShelfKey | null>(null);

  return (
    <div className="mt-6 space-y-9 lg:mt-8 lg:space-y-11">
      {shelves.map((s) => {
        const slugs = onShelf(s.key);
        const heading = (
          <h2 className="font-serif text-[22px] font-medium lg:text-[24px]">
            {s.label}{" "}
            <span className="font-sans text-[14px] font-medium text-muted">
              {slugs.length}
            </span>
          </h2>
        );
        if (view === "spines") {
          return (
            <section key={s.key}>
              <div className="mb-4 flex min-h-9 items-center justify-between gap-4">
                {heading}
                {slugs.length > 0 && (
                  <button
                    onClick={() => onSeeAll(s.key)}
                    className="flex h-9 items-center gap-1 text-[14px] font-semibold text-accent"
                  >
                    See all
                    <ChevronRightIcon size={15} />
                  </button>
                )}
              </div>
              <Bookcase
                slugs={slugs}
                shelf={s.key}
                addLabel={ADD_LABEL[s.key]}
                onAdd={() => setAdding(s.key)}
              />
            </section>
          );
        }
        return (
          <ScrollShelf
            key={s.key}
            ledgeTop="top-[160px] lg:top-[189px]"
            replayKey={`all-${s.key}`}
            heading={heading}
            action={
              slugs.length > 0 && (
                <button
                  onClick={() => onSeeAll(s.key)}
                  className="flex h-9 items-center gap-1 text-[14px] font-semibold text-accent"
                >
                  See all
                  <ChevronRightIcon size={15} />
                </button>
              )
            }
          >
            {slugs.map((slug) => (
              <li
                key={slug}
                data-shelf-item
                className="w-[107px] shrink-0 snap-start lg:w-[126px]"
              >
                <ShelfBook slug={slug} size="sm" />
                <BookCaption slug={slug} shelf={s.key} />
              </li>
            ))}
            <li
              data-shelf-item
              className="w-[107px] shrink-0 snap-start lg:w-[126px]"
            >
              <AddTile shelf={s.key} onClick={() => setAdding(s.key)} />
            </li>
          </ScrollShelf>
        );
      })}
      {adding && (
        <AddBooksSheet shelf={adding} onClose={() => setAdding(null)} />
      )}
    </div>
  );
}

function ShelfGrid({ shelf, view }: { shelf: ShelfKey; view: View }) {
  const { onShelf } = useReading();
  const [adding, setAdding] = useState(false);
  const slugs = onShelf(shelf);
  const label = shelves.find((s) => s.key === shelf)?.label;
  const note = {
    reading: "Pick up where you left off",
    want: "The rest of Red Rising, then all of A Song of Ice and Fire",
    dnf: "No guilt. Life's too short.",
    read: "In the order you read them",
  }[shelf];

  return (
    <section className="mt-6 lg:mt-8">
      <h2 className="font-serif text-[22px] font-medium lg:text-[26px]">
        {label}
      </h2>
      <p className="mt-0.5 text-[13px] text-muted">
        {slugs.length ? note : ""}
      </p>
      {slugs.length === 0 && (
        <p className="mt-1 text-[13px] text-muted">
          {shelf === "dnf"
            ? "You've finished everything you started. Impressive."
            : "Nothing here yet."}
        </p>
      )}
      {view === "spines" ? (
        <div className="mt-5">
          <Bookcase
            slugs={slugs}
            shelf={shelf}
            addLabel={ADD_LABEL[shelf]}
            onAdd={() => setAdding(true)}
          />
        </div>
      ) : (
        <ShelfReveal
          replayKey={`shelf-${shelf}`}
          className="mt-4 grid grid-cols-3 gap-3.5 sm:grid-cols-4 lg:grid-cols-6 lg:gap-[18px]"
        >
          {slugs.map((slug) => (
            <li key={slug} data-shelf-item>
              <ShelfBook slug={slug} size="sm" />
              <BookCaption slug={slug} shelf={shelf} />
            </li>
          ))}
          <li data-shelf-item>
            <AddTile shelf={shelf} onClick={() => setAdding(true)} />
          </li>
        </ShelfReveal>
      )}
      {adding && (
        <AddBooksSheet shelf={shelf} onClose={() => setAdding(false)} />
      )}
    </section>
  );
}

function StatsView({ onSeeRead }: { onSeeRead: () => void }) {
  const { onShelf } = useReading();
  const {
    stats,
    favouriteAuthor,
    readingTaste,
    challenge,
    challengeFriends,
    challengeRank,
    achievement,
  } = useSummary();
  const readSlugs = onShelf("read");
  const byPages = [...readSlugs].sort(
    (a, b) => getBook(b).pages - getBook(a).pages,
  );
  const maxPages = getBook(byPages[0])?.pages ?? 1;
  const challengePct = (challenge.read / challenge.goal) * 100;
  const challengeLine = `${challenge.read} of ${challenge.goal}${challenge.read >= challenge.goal ? " · goal reached" : ""} · ${ordinal(challengeRank)} of ${challengeFriends.length} friends`;
  const tags = [
    `${favouriteAuthor.count} by ${favouriteAuthor.name}`,
    `Avg ${stats.avgPages} pages`,
    ...(stats.novellas
      ? [`${stats.novellas} novella${stats.novellas > 1 ? "s" : ""}`]
      : []),
  ];

  return (
    <div className="animate-fade-in">
      <h2 className="mt-4 hidden font-serif text-[26px] font-medium lg:mt-6 lg:block">
        Your 2026 in reading
      </h2>

      {/* Phone: one summary card */}
      <div className="mt-4 rounded-[20px] border border-line bg-surface p-[18px] lg:hidden">
        <h2 className="font-serif text-[21px] font-medium">
          Your 2026 in reading
        </h2>
        <dl className="mt-3 grid grid-cols-3">
          {[
            [`${stats.booksRead}`, "books"],
            [formatPages(stats.pages), "pages"],
            [stats.avgRating.toFixed(1), "avg rating"],
          ].map(([v, l]) => (
            <div key={l}>
              <dt className="sr-only">{l}</dt>
              <dd className="font-serif text-[28px] font-medium leading-none">
                {v}
              </dd>
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
        <TasteBar taste={readingTaste} className="mt-2" />
        <TasteLegend
          taste={readingTaste}
          className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]"
        />
      </div>

      {/* Desktop: stat tiles */}
      <dl className="mt-4 hidden grid-cols-4 gap-4 lg:grid">
        {[
          [`${stats.booksRead}`, "books read"],
          [formatPages(stats.pages), "pages turned"],
          [stats.avgRating.toFixed(1), "average rating"],
        ].map(([v, l]) => (
          <div
            key={l}
            className="rounded-[20px] border border-line bg-surface p-5"
          >
            <dd className="font-serif text-[40px] font-medium leading-none">
              {v}
            </dd>
            <dt className="mt-3 text-[13px] text-muted">{l}</dt>
          </div>
        ))}
        <div className="rounded-[20px] bg-accent-soft p-5">
          <dd className="font-serif text-[40px] font-medium leading-none">
            {Math.round(challengePct)}%
          </dd>
          <dt className="mt-3 text-[13px] text-muted">{challengeLine}</dt>
          <ProgressBar value={challengePct} height={5} className="mt-3" />
        </div>
      </dl>

      <div className="mt-6 hidden gap-4 lg:grid lg:grid-cols-[minmax(0,672fr)_minmax(0,432fr)]">
        <section className="rounded-[20px] border border-line bg-surface p-6">
          <div className="flex items-baseline justify-between">
            <Eyebrow>Pages per book</Eyebrow>
            <span className="text-[12px] text-muted">
              {formatPages(stats.pages)} pages in total
            </span>
          </div>
          <ul className="mt-4 space-y-2.5">
            {byPages.map((slug) => {
              const b = getBook(slug);
              return (
                <li
                  key={slug}
                  className="grid grid-cols-[150px_minmax(0,1fr)_36px] items-center gap-3 text-[13px]"
                >
                  <span className="truncate" title={b.title}>
                    {b.title}
                  </span>
                  <ProgressBar
                    value={(b.pages / maxPages) * 100}
                    height={10}
                    track="transparent"
                  />
                  <span className="text-right tabular-nums text-muted">
                    {b.pages}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-[20px] border border-line bg-surface p-6">
          <Eyebrow>Your reading taste</Eyebrow>
          <TasteBar taste={readingTaste} className="mt-4" />
          <TasteLegend
            taste={readingTaste}
            className="mt-4 space-y-2.5 text-[14px]"
          />
          <ul className="mt-5 flex flex-wrap gap-2 border-t border-line pt-5">
            {tags.map((t) => (
              <li
                key={t}
                className="rounded-full bg-accent-soft px-3 py-1.5 text-[13px] font-semibold text-accent"
              >
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
                <span className={`w-14 ${f.you ? "font-semibold" : ""}`}>
                  {f.name}
                </span>
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

        {achievement && (
          <Achievement title={achievement.title} text={achievement.text} />
        )}
      </div>

      <button
        onClick={onSeeRead}
        className="mt-6 flex h-11 items-center gap-1.5 text-[14px] font-semibold text-accent lg:mt-8"
      >
        See all {readSlugs.length} books you&apos;ve read
        <ChevronRightIcon size={16} />
      </button>
    </div>
  );
}

type Taste = ReturnType<typeof useSummary>["readingTaste"];

function TasteBar({
  taste,
  className = "",
}: {
  taste: Taste;
  className?: string;
}) {
  return (
    <div className={`flex h-3 gap-[3px] overflow-hidden ${className}`}>
      {taste.map((t) => (
        <span
          key={t.label}
          className="rounded-[3px]"
          style={{ flexBasis: `${t.pct}%`, background: t.color }}
        />
      ))}
    </div>
  );
}

function TasteLegend({
  taste,
  className = "",
}: {
  taste: Taste;
  className?: string;
}) {
  return (
    <ul className={className}>
      {taste.map((t) => (
        <li key={t.label} className="flex items-center gap-2 text-muted">
          <span
            className="h-3 w-3 shrink-0 rounded-[3px]"
            style={{ background: t.color }}
          />
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
          <p className="text-[14px] font-semibold lg:font-serif lg:text-[22px] lg:font-medium">
            {title}
          </p>
          <p className="text-[12px] text-muted lg:text-[14px]">{text}</p>
        </div>
      </div>
      <div className="flex gap-2.5 lg:mt-5">
        <button
          onClick={() => setShared(true)}
          className="h-11 shrink-0 rounded-full border border-accent px-4 text-[13px] font-semibold text-accent transition-colors lg:bg-accent lg:px-5 lg:text-[14px] lg:text-on-accent"
        >
          <span className="lg:hidden">{shared ? "Shared ✓" : "Share"}</span>
          <span className="hidden lg:inline">
            {shared ? "Link copied ✓" : "Share your year so far"}
          </span>
        </button>
        <button className="hidden h-11 rounded-full border border-accent px-5 text-[14px] font-semibold text-accent lg:block">
          See all badges
        </button>
      </div>
    </section>
  );
}
