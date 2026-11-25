"use client";

import { booksByGenre, getBook } from "@/lib/data";
import { BadgeIcon } from "../Icons";
import { ProgressBar } from "../ProgressBar";
import { useReading } from "../ReadingProvider";
import { Sheet } from "../Sheet";

/** Every badge, earned or in progress, worked out from the live shelves. */
export function BadgesSheet({ onClose }: { onClose: () => void }) {
  const { onShelf, goal } = useReading();
  const read = onShelf("read");
  const has = (slug: string) => read.includes(slug);
  const count = (slugs: string[]) => slugs.filter(has).length;

  const badges = [
    { title: "Different Seasons, complete", text: "Read all four Stephen King novellas", have: count(["rita-hayworth", "apt-pupil", "the-body", "the-breathing-method"]), need: 4 },
    { title: "Goal getter", text: `Reach your goal of ${goal} books`, have: read.length, need: goal },
    { title: "Ten-book year", text: "Finish 10 books in 2026", have: read.length, need: 10 },
    { title: "Constant Reader", text: "Read 5 books by Stephen King", have: read.filter((s) => getBook(s).author === "Stephen King").length, need: 5 },
    { title: "Real life", text: "Read 3 memoirs", have: count(booksByGenre.Memoir), need: 3 },
    { title: "Red Rising trilogy", text: "Finish Red Rising, Golden Son and Morning Star", have: count(["red-rising", "golden-son", "morning-star"]), need: 3 },
    { title: "Doorstopper", text: "Finish a book over 700 pages", have: read.some((s) => getBook(s).pages > 700) ? 1 : 0, need: 1 },
    { title: "Winter is coming", text: "Read all five A Song of Ice and Fire books", have: count(["a-game-of-thrones", "a-clash-of-kings", "a-storm-of-swords", "a-feast-for-crows", "a-dance-with-dragons"]), need: 5 },
  ]
    .map((b) => ({ ...b, earned: b.have >= b.need }))
    .sort((a, b) => Number(b.earned) - Number(a.earned));

  const earned = badges.filter((b) => b.earned).length;

  return (
    <Sheet title="Badges" subtitle={`${earned} of ${badges.length} earned`} onClose={onClose}>
      <ul className="space-y-2.5">
        {badges.map((b) => (
          <li key={b.title} className={`flex items-center gap-3.5 rounded-2xl p-3.5 ${b.earned ? "bg-accent-soft" : "border border-line bg-surface"}`}>
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                b.earned ? "bg-accent text-on-accent" : "bg-bg text-muted"
              }`}
            >
              <BadgeIcon size={20} />
            </span>
            <span className="min-w-0 flex-1">
              <span className={`block text-[14px] font-semibold ${b.earned ? "text-accent" : ""}`}>{b.title}</span>
              <span className="block text-[12px] text-muted">{b.text}</span>
              {!b.earned && <ProgressBar value={(b.have / b.need) * 100} height={4} className="mt-2" />}
            </span>
            <span className="shrink-0 text-[12px] font-semibold tabular-nums text-muted">
              {b.earned ? "Earned" : `${b.have}/${b.need}`}
            </span>
          </li>
        ))}
      </ul>
    </Sheet>
  );
}
