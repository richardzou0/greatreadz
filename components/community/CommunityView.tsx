"use client";

import Link from "next/link";
import { useState } from "react";
import { getBook } from "@/lib/data";
import { activity, booksThisYear, clubs, friendByName, friends, sharedReads, type Activity, type Friend } from "@/lib/social";
import { BookCover } from "../BookCover";
import { CheckIcon, ChevronRightIcon, PlusIcon, StarSmall } from "../Icons";
import { ProgressBar } from "../ProgressBar";
import { useSummary } from "../ReadingProvider";
import { ThemeToggle } from "../ThemeToggle";
import { Eyebrow, PageTitle } from "../ui";

const GROUPS: Activity["when"][] = ["Today", "Yesterday", "This week"];

// Community: light-touch social. Updates from people you follow, your friends, clubs and the challenge.
// No algorithmic feed and no strangers.
export function CommunityView() {
  const [only, setOnly] = useState<string | null>(null);
  const feed = only ? activity.filter((a) => a.friend === only) : activity;

  return (
    <main className="mx-auto max-w-[1216px] px-5 pb-12 pt-14 lg:px-12 lg:pt-10">
      <PageTitle right={<ThemeToggle className="lg:hidden" />}>Community</PageTitle>
      <p className="mt-1 max-w-[560px] text-[14px] text-muted lg:text-[15px]">
        What the people you follow are reading. No algorithm, no strangers.
      </p>

      <div className="mt-6 grid gap-x-8 gap-y-10 lg:mt-9 lg:grid-cols-[minmax(0,1fr)_minmax(300px,376px)]">
        {/* Feed. min-w-0 lets the friend chips scroll inside it instead of widening the page on phones. */}
        <section aria-labelledby="feed" className="min-w-0">
          <div className="flex items-center justify-between gap-3">
            <Eyebrow>
              <span id="feed">Friends&apos; activity</span>
            </Eyebrow>
            {only && (
              <button onClick={() => setOnly(null)} className="h-9 text-[13px] font-semibold text-accent">
                Show everyone
              </button>
            )}
          </div>

          {/* Filter by friend */}
          <div role="radiogroup" aria-label="Show updates from" className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:px-0">
            <FilterChip active={!only} onClick={() => setOnly(null)}>
              Everyone
            </FilterChip>
            {friends.map((f) => (
              <FilterChip key={f.name} active={only === f.name} onClick={() => setOnly(only === f.name ? null : f.name)}>
                <Avatar friend={f} size={22} />
                {f.name}
              </FilterChip>
            ))}
          </div>

          {GROUPS.map((group) => {
            const items = feed.filter((a) => a.when === group);
            if (!items.length) return null;
            return (
              <div key={group} className="mt-6">
                <p className="text-[13px] font-semibold text-muted">{group}</p>
                <ul className="mt-2 space-y-3">
                  {items.map((a) => (
                    <ActivityCard key={a.id} item={a} onFriend={setOnly} />
                  ))}
                </ul>
              </div>
            );
          })}
        </section>

        {/* Side column */}
        <div className="min-w-0 space-y-10">
          <FriendsList active={only} onPick={(name) => setOnly(only === name ? null : name)} />
          <Clubs />
          <Challenge />
        </div>
      </div>
    </main>
  );
}

function Avatar({ friend, size = 36 }: { friend: Friend; size?: number }) {
  return (
    <span
      aria-hidden
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-[#1b1712]"
      style={{ width: size, height: size, background: friend.tint, fontSize: size * 0.42 }}
    >
      {friend.initial}
    </span>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={`flex h-11 shrink-0 items-center gap-2 rounded-full border pl-2.5 pr-4 text-[14px] font-semibold transition-colors first:pl-4 ${
        active ? "border-accent bg-accent text-on-accent" : "border-line bg-surface hover:border-accent/50"
      }`}
    >
      {children}
    </button>
  );
}

function ActivityCard({ item, onFriend }: { item: Activity; onFriend: (name: string) => void }) {
  const friend = friendByName[item.friend];
  const book = item.slug ? getBook(item.slug) : undefined;
  const [cheered, setCheered] = useState(false);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [mine, setMine] = useState<string[]>([]);
  const replies = [...item.replies, ...mine.map((text) => ({ from: "Rich", text }))];

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMine((m) => [...m, text]);
    setDraft("");
  };

  return (
    <li className="rounded-[20px] border border-line bg-surface p-4 lg:p-5">
      <div className="flex gap-3.5">
        <button onClick={() => onFriend(item.friend)} aria-label={`Show only ${item.friend}`} className="h-fit">
          <Avatar friend={friend} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] leading-snug lg:text-[15px]">
            <span className="font-semibold">{item.friend}</span> {item.verb}
            {book && (
              <>
                {" "}
                <Link href={`/book/${book.slug}`} className="font-serif text-[16px] font-medium hover:underline lg:text-[17px]">
                  {book.title}
                </Link>
              </>
            )}
            {item.club && item.verb !== "joined" && <span className="text-muted"> with {item.club}</span>}
            {item.club && item.verb === "joined" && <span className="font-semibold"> {item.club}</span>}
            <span className="whitespace-nowrap text-[12px] text-muted"> · {item.time}</span>
          </p>

          {item.rating && (
            <p className="mt-1.5 flex items-center gap-1 text-[13px] font-semibold">
              <StarSmall size={12} className="text-accent" />
              {item.rating}
            </p>
          )}
          {item.review && <p className="mt-2 text-[14px] leading-[1.55] lg:text-[15px]">“{item.review}”</p>}
          {item.hook && (
            <p className="mt-3 inline-block rounded-xl bg-accent-soft px-3 py-2 text-[13px] font-medium text-accent">{item.hook}</p>
          )}

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => setCheered((c) => !c)}
              aria-pressed={cheered}
              className={`h-9 rounded-full border px-3.5 text-[13px] font-semibold transition-all active:scale-95 ${
                cheered ? "border-accent bg-accent text-on-accent" : "border-line text-accent hover:bg-bg"
              }`}
            >
              {cheered ? "Cheered" : "Cheer"} · {item.cheers + (cheered ? 1 : 0)}
            </button>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              className="h-9 rounded-full px-3 text-[13px] font-semibold text-muted transition-colors hover:text-ink"
            >
              {replies.length ? `${replies.length} repl${replies.length > 1 ? "ies" : "y"}` : "Reply"}
            </button>
          </div>

          {open && (
            <div className="animate-fade-in mt-3 space-y-2.5 border-t border-line pt-3">
              {replies.map((r, i) => (
                <p key={i} className="text-[14px] leading-snug">
                  <span className="font-semibold">{r.from}</span> {r.text}
                </p>
              ))}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                className="flex gap-2 pt-1"
              >
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={`Reply to ${item.friend}…`}
                  aria-label={`Reply to ${item.friend}`}
                  className="h-11 min-w-0 flex-1 rounded-full border border-line bg-bg px-4 text-[14px] placeholder:text-muted focus:border-accent focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  className="h-11 rounded-full bg-accent px-4 text-[13px] font-semibold text-on-accent transition-opacity disabled:opacity-40"
                >
                  Send
                </button>
              </form>
            </div>
          )}
        </div>
        {book && (
          <Link href={`/book/${book.slug}`} className="hidden shrink-0 sm:block" aria-hidden tabIndex={-1}>
            <BookCover slug={book.slug} href={null} size="sm" className="w-14 lg:w-16" />
          </Link>
        )}
      </div>
    </li>
  );
}

function FriendsList({ active, onPick }: { active: string | null; onPick: (name: string) => void }) {
  return (
    <section aria-labelledby="friends-list">
      <Eyebrow>
        <span id="friends-list">Your friends</span>
      </Eyebrow>
      <ul className="mt-3 divide-y divide-line rounded-[20px] border border-line bg-surface">
        {friends.map((f) => {
          const reading = getBook(f.reading);
          const year = booksThisYear(f.name);
          const shared = sharedReads(f.name);
          return (
            <li key={f.name}>
              <button
                onClick={() => onPick(f.name)}
                aria-pressed={active === f.name}
                className={`flex w-full items-center gap-3 p-3.5 text-left transition-colors first:rounded-t-[20px] hover:bg-bg ${
                  active === f.name ? "bg-accent-soft" : ""
                }`}
              >
                <Avatar friend={f} />
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-semibold">{f.name}</span>
                  <span className="block truncate text-[12px] text-muted">
                    Reading <span className="font-serif text-[13px] text-ink">{reading?.title}</span>
                  </span>
                  <span className="block text-[12px] text-muted">
                    {year !== null ? `${year} books this year` : "Not in the challenge"}
                    {shared.length > 0 && ` · you've both read ${getBook(shared[0]).title}`}
                  </span>
                </span>
                {reading && <BookCover slug={reading.slug} href={null} size="sm" className="w-9 shrink-0" />}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Clubs() {
  const [joined, setJoined] = useState<Record<string, boolean>>({});
  return (
    <section aria-labelledby="clubs-heading" id="clubs" className="scroll-mt-6">
      <Eyebrow>
        <span id="clubs-heading">Book clubs</span>
      </Eyebrow>
      <ul className="mt-3 space-y-3">
        {clubs.map((c) => {
          const book = getBook(c.slug);
          const on = !!joined[c.id];
          return (
            <li key={c.id} className="rounded-[20px] border border-line bg-surface p-4">
              <div className="flex gap-3.5">
                <BookCover slug={c.slug} size="sm" className="w-12 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold">{c.name}</p>
                  <p className="truncate text-[13px] text-muted">
                    Reading <span className="font-serif text-[14px] text-ink">{book.title}</span>
                  </p>
                  <p className="mt-0.5 text-[12px] text-muted">
                    {c.members + (on ? 1 : 0)} members · {c.friendsIn.join(" & ")} {c.friendsIn.length > 1 ? "are" : "is"} in · {c.posts} posts
                  </p>
                </div>
              </div>
              <p className="mt-3 flex justify-between text-[12px]">
                <span className="font-semibold">This week: {c.thisWeek}</span>
                <span className="text-muted">{c.progress}%</span>
              </p>
              <ProgressBar value={c.progress} height={5} className="mt-1.5" />
              <button
                onClick={() => setJoined((j) => ({ ...j, [c.id]: !on }))}
                aria-pressed={on}
                className={`mt-3.5 flex h-10 w-full items-center justify-center gap-1.5 rounded-full text-[13px] font-semibold transition-all active:scale-[0.98] ${
                  on ? "bg-accent text-on-accent" : "border border-accent text-accent hover:bg-accent-soft"
                }`}
              >
                {on ? <CheckIcon size={15} /> : <PlusIcon size={15} />}
                {on ? "Joined" : "Join club"}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Challenge() {
  const { challenge, challengeFriends } = useSummary();
  return (
    <section aria-labelledby="challenge">
      <div className="flex items-center justify-between">
        <Eyebrow>
          <span id="challenge">2026 challenge</span>
        </Eyebrow>
        <Link href="/my-books?shelf=stats" className="flex h-9 items-center gap-1 text-[13px] font-semibold text-accent">
          Your stats
          <ChevronRightIcon size={14} />
        </Link>
      </div>
      <ol className="mt-3 space-y-3 rounded-[20px] border border-line bg-surface p-4">
        {challengeFriends.map((f, i) => (
          <li key={f.name} className="flex items-center gap-3 text-[14px]">
            <span className="w-3 font-semibold">{i + 1}</span>
            <span className={`w-12 ${f.you ? "font-semibold" : ""}`}>{f.you ? "You" : f.name}</span>
            <ProgressBar
              value={(f.read / challenge.goal) * 100}
              height={6}
              className="flex-1"
              fill={f.you ? "var(--accent)" : "var(--taste-3)"}
            />
            <span className="w-12 whitespace-nowrap text-right tabular-nums text-muted">
              {f.read} / {challenge.goal}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
