"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { CHALLENGE_DAYS_LEFT, friendsActivity, topPick } from "@/lib/data";
import { BookCover } from "../BookCover";
import { ProgressBar } from "../ProgressBar";
import { GoalSheet } from "../my-books/GoalSheet";
import { useReading, useSummary } from "../ReadingProvider";

const partOfDay = () => {
  const h = new Date().getHours();
  return h < 12 ? "morning" : h < 18 ? "afternoon" : "evening";
};

export function Greeting() {
  const part = useSyncExternalStore(() => () => {}, partOfDay, () => "evening");
  return <>Good {part}, Rich</>;
}

/** One smart pick, with the reason spelled out. */
export function PickedForYou() {
  const { shelfOf, setShelf } = useReading();
  const [dismissed, setDismissed] = useState(false);
  const book = topPick;
  const wanted = shelfOf(book.slug) === "want";
  const toggle = () => setShelf(book.slug, wanted ? null : "want");

  if (dismissed) {
    return (
      <div className="animate-fade-in rounded-[20px] bg-accent-soft p-5 text-[14px] lg:p-6">
        <p className="font-semibold text-accent">Got it. We&apos;ll pick differently.</p>
        <p className="mt-1 text-muted">Fewer books like {book.title} for a while.</p>
        <button onClick={() => setDismissed(false)} className="mt-3 font-semibold text-accent underline underline-offset-4">
          Undo
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-[20px] bg-accent-soft p-4 lg:p-6">
      <div className="flex gap-4">
        <BookCover slug={book.slug} className="w-16 shrink-0 lg:w-20" size="sm" />
        <div className="min-w-0">
          <Link href={`/book/${book.slug}`} className="font-serif text-[19px] font-medium hover:underline lg:text-[22px]">
            {book.title}
          </Link>
          <p className="hidden text-[14px] text-muted lg:block">{book.author}</p>
          <p className="mt-1 text-[12px] leading-snug text-muted lg:mt-1.5 lg:text-[14px] lg:leading-[1.45] lg:text-ink">{book.why}</p>
          <p className="mt-1.5 hidden text-[12px] text-muted lg:block">Based on your 4+ star books, not on what&apos;s trending</p>
          <div className="mt-3 flex gap-2 lg:hidden">
            <PickButtons wanted={wanted} onWant={toggle} onDismiss={() => setDismissed(true)} />
          </div>
        </div>
      </div>
      <div className="mt-4 hidden gap-2 lg:flex">
        <PickButtons wanted={wanted} onWant={toggle} onDismiss={() => setDismissed(true)} />
      </div>
    </div>
  );
}

function PickButtons({ wanted, onWant, onDismiss }: { wanted: boolean; onWant: () => void; onDismiss: () => void }) {
  return (
    <>
      <button
        onClick={onWant}
        className="h-11 rounded-full bg-accent px-[18px] text-[13px] font-semibold text-on-accent transition-transform active:scale-95 lg:text-[14px]"
      >
        {wanted ? "✓ On your list" : "Want to read"}
      </button>
      <button
        onClick={onDismiss}
        className="h-11 rounded-full border border-accent px-4 text-[13px] font-semibold text-accent transition-colors hover:bg-surface lg:text-[14px]"
      >
        Not for me
      </button>
    </>
  );
}

export function ChallengeCard() {
  const { challenge } = useSummary();
  const [editing, setEditing] = useState(false);
  const reached = challenge.read >= challenge.goal;
  return (
    <div className="rounded-[20px] border border-line bg-surface p-6">
      <div className="flex items-baseline justify-between gap-3">
        <Link href="/my-books?shelf=stats" className="font-serif text-[20px] font-medium hover:underline">
          2026 reading challenge
        </Link>
        <button onClick={() => setEditing(true)} className="text-[13px] font-semibold text-accent underline-offset-2 hover:underline">
          Edit goal
        </button>
      </div>
      <p className="mt-2 flex items-baseline gap-3">
        <span className="font-serif text-[40px] font-medium leading-none">{challenge.read}</span>
        <span className="text-[14px] text-muted">of {challenge.goal} books</span>
      </p>
      <ProgressBar value={Math.min(100, (challenge.read / challenge.goal) * 100)} className="mt-4" />
      <p className="mt-4 text-[13px] text-muted">
        {reached
          ? `Goal reached with ${CHALLENGE_DAYS_LEFT} days to spare`
          : `${
              challenge.vsPace === 0
                ? "Right on schedule"
                : `${Math.abs(challenge.vsPace)} book${Math.abs(challenge.vsPace) > 1 ? "s" : ""} ${challenge.vsPace > 0 ? "ahead of" : "behind"} schedule`
            } · ${challenge.goal - challenge.read} to go`}
      </p>
      {editing && <GoalSheet onClose={() => setEditing(false)} />}
    </div>
  );
}

/** Light-touch social: three updates and a cheer button. No feed. */
export function FriendsActivity() {
  const [cheered, setCheered] = useState<Record<string, boolean>>({});
  return (
    <ul>
      {friendsActivity.map((a) => (
        <li key={a.name} className="flex items-center gap-3 border-b border-line py-3.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[13px] font-semibold text-accent">
            {a.initial}
          </span>
          <p className="min-w-0 flex-1 text-[14px] leading-snug">
            <span className="font-semibold">{a.name}</span> {a.text}
          </p>
          <button
            onClick={() => setCheered((c) => ({ ...c, [a.name]: !c[a.name] }))}
            aria-pressed={!!cheered[a.name]}
            className={`h-11 shrink-0 rounded-full border px-3.5 text-[13px] font-semibold transition-all active:scale-95 ${
              cheered[a.name] ? "border-accent bg-accent text-on-accent" : "border-line bg-surface text-accent"
            }`}
          >
            {cheered[a.name] ? "Cheered" : "Cheer"}
          </button>
        </li>
      ))}
    </ul>
  );
}
